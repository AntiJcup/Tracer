import { TraceTransactionLog, TraceProject, TraceTransaction } from '../../models/ts/Tracer_pb';
import { TransactionLoader } from './TransactionLoader';
import { ProjectLoader } from './ProjectLoader';

export interface TransactionPlayerSettings {
    speedMultiplier: number;
    lookAheadSize: number;
    loadChunkSize: number; // Always make sure this is greater than look ahead
    updateInterval: number;
    loadInterval: number;
    customIncrementer: boolean;
}

export enum TransactionPlayerState {
    Paused,
    Playing,
}

export abstract class TransactionPlayer {
    private loadingChunk = false;
    private internalLoadPosition = 0;
    private internalPosition = 0;
    private previousPosition = -1;
    private project: TraceProject = null;
    private internalState: TransactionPlayerState = TransactionPlayerState.Paused;
    private internalUpdateInterval: any = null;
    private internalLoadInterval: any = null;
    private transactionLogs: TraceTransactionLog[] = [];
    private transactionLogIndex = 0;

    public get position(): number {
        return this.internalPosition;
    }

    public set position(offset: number) {
        this.internalPosition = offset;
        if (this.settings.customIncrementer) {
            this.UpdateLoop();
        }
    }

    public get loadPosition() {
        return this.internalLoadPosition;
    }

    public get duration(): number {
        this.ThrowIfNotLoaded();

        return this.project.getDuration();
    }

    public get state(): TransactionPlayerState {
        return this.internalState;
    }

    public get isBuffering(): boolean {
        return this.internalPosition >= this.internalLoadPosition && this.duration > this.internalLoadPosition;
    }

    constructor(
        public settings: TransactionPlayerSettings,
        protected projectLoader: ProjectLoader,
        protected transactionLoader: TransactionLoader,
        protected projectId: string) {
        if (this.settings.loadChunkSize <= this.settings.lookAheadSize) {
            throw new Error('loadChunkSize needs to be greater than lookAheadSize');
        }
    }

    public async Load(): Promise<void> {
        this.project = await this.projectLoader.LoadProject(this.projectId);
        console.log(`Project Loaded: ${JSON.stringify(this.project.toObject())}`);
        if (!this.settings.customIncrementer) {
            this.internalUpdateInterval = setInterval(() => this.UpdateLoop(), this.settings.updateInterval);
        }
        this.internalLoadInterval = setInterval(() => this.LoadLoop(), this.settings.loadInterval);
        this.LoadLoop();
    }

    public Dispose(): void {
        clearInterval(this.internalUpdateInterval);
        clearInterval(this.internalLoadInterval);
    }

    public Play(): void {
        this.ThrowIfNotLoaded();
        this.internalState = TransactionPlayerState.Playing;
    }

    public Pause(): void {
        this.ThrowIfNotLoaded();

        this.internalState = TransactionPlayerState.Paused;
        this.internalPosition = this.previousPosition; // Snap to where we actually are
    }

    public SetPostionPct(pct: number) {
        if (pct > 1 || pct < 0) {
            throw new Error('Invalid pct');
        }

        const newPos = this.duration * pct;
        this.position = newPos;
    }

    protected ThrowIfNotLoaded(): void {
        if (this.project == null) {
            throw new Error('project not loaded');
        }
    }

    protected LoadLoop(): void {
        if (this.loadingChunk || this.project == null) {
            return;
        }

        if (this.internalLoadPosition > this.internalPosition + this.settings.lookAheadSize) {
            return;
        }

        if (this.internalLoadPosition >= this.project.getDuration()) {
            return;
        }

        this.loadingChunk = true;

        const start = this.internalLoadPosition;
        const end = start + (this.settings.loadChunkSize);
        this.transactionLoader.GetTransactionLogs(this.project, start, end).then((transactionLogs: TraceTransactionLog[]) => {
            this.transactionLogs = this.transactionLogs.concat(transactionLogs);
            this.internalLoadPosition = end;
        }).finally(() => {
            this.loadingChunk = false;
        });
    }

    protected UpdateLoop(): void {
        if (this.previousPosition === this.internalPosition && this.state === TransactionPlayerState.Paused) {
            return;
        }

        if (this.isBuffering) {
            return;
        }

        // Handle rewind
        let lastTransactionOffset = 0;
        let lastActedTransactionOffset = this.previousPosition;
        if (this.internalPosition < this.previousPosition) {
            while (this.internalPosition < this.previousPosition && this.transactionLogIndex >= 0) {
                const currentTransactionLog = this.transactionLogs[this.transactionLogIndex--];
                if (currentTransactionLog == null) {
                    continue;
                }
                for (const transaction of currentTransactionLog.getTransactionsList().slice().reverse()) {
                    lastTransactionOffset = transaction.getTimeOffsetMs();
                    if (lastTransactionOffset <= this.previousPosition && lastTransactionOffset > this.internalPosition) {
                        this.HandleTransaction(transaction, true);
                        lastActedTransactionOffset = lastTransactionOffset;
                    }
                }
                this.previousPosition = lastActedTransactionOffset;
            }
            this.previousPosition = this.internalPosition;
        }

        const currentTransaction = this.FindCurrentPlayTransaction();
        const passedLoader = this.internalPosition >= this.internalLoadPosition;
        if (!currentTransaction) {
            if (!passedLoader && this.internalPosition <= this.project.getDuration()) {
                this.internalPosition += this.settings.updateInterval;
            }
            return;
        }

        lastTransactionOffset = 0;
        lastActedTransactionOffset = 0;
        for (const transaction of currentTransaction.getTransactionsList()) {
            lastTransactionOffset = transaction.getTimeOffsetMs();
            if (lastTransactionOffset > this.previousPosition && lastTransactionOffset <= this.internalPosition) {
                this.HandleTransaction(transaction);
                lastActedTransactionOffset = lastTransactionOffset;
            }
        }
        if (this.previousPosition < lastActedTransactionOffset) {
            this.previousPosition = lastActedTransactionOffset;
        }

        if (!this.settings.customIncrementer) {
            this.internalPosition += this.settings.updateInterval;
        }
    }

    protected FindCurrentPlayTransaction(): TraceTransactionLog {
        if (this.transactionLogIndex < 0) {
            this.transactionLogIndex = 0;
        }

        const currentTransactionLog = this.transactionLogs[this.transactionLogIndex];
        if (!currentTransactionLog) {
            if (this.transactionLogs.length > 0 && this.transactionLogs[this.transactionLogIndex - 1].getPartition() >=
                (this.project.getDuration() / this.project.getPartitionSize())) {
                // this.Pause();
            }
            return null;
        }

        const transactionList = currentTransactionLog.getTransactionsList();
        if (transactionList.length === 0 || transactionList[transactionList.length - 1].getTimeOffsetMs() <= this.previousPosition) {
            ++this.transactionLogIndex;
            return this.FindCurrentPlayTransaction();
        }

        return currentTransactionLog;
    }

    protected abstract HandleTransaction(transaction: TraceTransaction, undo?: boolean): void;
}
