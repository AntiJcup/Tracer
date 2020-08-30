import {
    TraceProject,
    TraceTransactionLog,
    TraceTransaction,
    CreateItemData,
    DeleteItemData,
    ModifyFileData,
    SelectFileData,
    CursorChangeFileData,
    RenameItemData,
    UploadFileData,
    MouseMoveData,
    CustomActionData,
    ScrollFileData
} from '../../models/ts/Tracer_pb';
import { PartitionFromOffsetBottom } from './Common';
import { ITransactionWriter } from './ITransactionWriter';
import { IProjectReader } from './IProjectReader';
import { IProjectWriter } from './IProjectWriter';
import { Guid } from 'guid-typescript';

export class TransactionRecorder {
    protected changed = false;
    protected project: TraceProject;
    private initialTimeOffset = 0;
    private lastPreviewPath: string;
    private savedTransactionLogPartions: number[] = new Array<number>();

    public get logs(): TraceTransactionLog[] {
        return this.transactionLogs;
    }

    public get hasChanged(): boolean {
        return this.changed;
    }

    constructor(
        protected id: string,
        private projectLoader: IProjectReader,
        private projectWriter: IProjectWriter,
        private transactionWriter: ITransactionWriter,
        protected cacheBuster: string,
        protected transactionLogs: TraceTransactionLog[] = []) {

        const presavedTransactions = this.transactionLogs.sort((a, b) => {
            return a.getPartition() > b.getPartition() ? 1 : -1;
        }).map((transactionLog: TraceTransactionLog) => {
            return transactionLog.getPartition();
        });
        console.log(`loaded transaction logs: ${presavedTransactions}`);
        presavedTransactions.pop();
        this.savedTransactionLogPartions = this.savedTransactionLogPartions.concat(presavedTransactions);
        console.log(`presaved transaction logs: ${this.savedTransactionLogPartions}`);
    }

    // Call this if you are starting a new recording session
    public async New(): Promise<void> {
        this.project = await this.CreateProject(this.id);
        this.Reset();

        if (!this.project) {
            throw new Error('Failed to load project id: ' + this.id);
        }
    }

    // Call this if you are loading an existing recording session
    public async Load(): Promise<void> {
        this.project = await this.LoadProject(this.id);

        if (!this.project) {
            throw new Error('Failed to load project id: ' + this.id);
        }
    }

    public async CreateProject(id: string): Promise<TraceProject> {
        const result = await this.projectWriter.CreateProject(id);
        if (!result) {
            throw new Error('Failed to create project id: ' + id);
        }

        return await this.LoadProject(id);
    }

    public async LoadProject(id: string): Promise<TraceProject> {
        return await this.projectLoader.GetProject(id, this.cacheBuster);
    }

    public async ResetProject(id: string): Promise<boolean> {
        return await this.projectWriter.ResetProject(id);
    }

    public GetTransactionLogByTimeOffset(timeOffset: number): TraceTransactionLog {
        this.ThrowIfNotLoaded();
        let transactionLog: TraceTransactionLog = null;
        const partition = PartitionFromOffsetBottom(this.project, timeOffset);
        while (this.transactionLogs.length === 0 || partition !== (this.transactionLogs[this.transactionLogs.length - 1].getPartition())) {
            transactionLog = new TraceTransactionLog();
            transactionLog.setPartition(this.transactionLogs.length);
            if (transactionLog.getPartition() > partition) {
                break;
            }
            this.transactionLogs.push(transactionLog);
            // console.log(`Created transaction log ${JSON.stringify(transactionLog.toObject())}`);
        }

        if (transactionLog == null) {
            transactionLog = this.transactionLogs[partition];
        }

        return transactionLog;
    }

    protected AddTransaction(transaction: TraceTransaction): TraceTransaction {
        this.changed = true;
        this.ThrowIfNotLoaded();
        const transactionLog = this.GetTransactionLogByTimeOffset(transaction.getTimeOffsetMs());
        transactionLog.addTransactions(transaction);
        this.project.setDuration(this.project.getDuration() + transaction.getTimeOffsetMs());

        // console.log(`Adding transaction ${JSON.stringify(transaction.toObject())}`);
        return transaction;
    }

    public CreateItem(timeOffset: number, oldFilePath: string, newFilePath: string, isFolder: boolean): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CREATEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(oldFilePath);
        const data = new CreateItemData();
        data.setIsFolder(isFolder);
        data.setNewFilePath(newFilePath);
        transaction.setCreateFile(data);

        return this.AddTransaction(transaction);
    }

    public DeleteFile(timeOffset: number, filePath: string, previousData: string, isFolder: boolean): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.DELETEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new DeleteItemData();
        data.setPreviousData(previousData);
        data.setIsFolder(isFolder);
        transaction.setDeleteFile(data);

        return this.AddTransaction(transaction);
    }

    public ModifyFile(timeOffset: number, filePath: string, offsetStart: number, offsetEnd: number, insertData: string, previousData?: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.MODIFYFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new ModifyFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        data.setData(insertData);
        data.setPreviousData(previousData);
        transaction.setModifyFile(data);

        return this.AddTransaction(transaction);
    }

    public SelectFile(timeOffset: number, oldFilePath: string, newFilePath: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.SELECTFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(oldFilePath);
        const data = new SelectFileData();
        data.setNewFilePath(newFilePath);
        transaction.setSelectFile(data);

        return this.AddTransaction(transaction);
    }

    public CursorFocusChangeFile(timeOffset: number, filePath: string, offsetStart: number, offsetEnd: number): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CURSORFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new CursorChangeFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        transaction.setCursorFile(data);

        return this.AddTransaction(transaction);
    }

    public RenameFile(timeOffset: number, filePath: string, newFilePath: string, previousData: string, isFolder: boolean): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.RENAMEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new RenameItemData();
        data.setNewFilePath(newFilePath);
        data.setPreviousData(previousData);
        data.setIsFolder(isFolder);
        transaction.setRenameFile(data);

        return this.AddTransaction(transaction);
    }

    public UploadFile(timeOffset: number, oldFilePath: string, newFilePath: string, resourceId: string) {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.UPLOADFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(oldFilePath);
        const data = new UploadFileData();
        data.setNewFilePath(newFilePath);
        data.setResourceId(resourceId);
        transaction.setUploadFile(data);

        return this.AddTransaction(transaction);
    }

    public SelectText(timeOffset: number, file: string, offsetStart: number, offsetEnd: number) {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CURSORFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(file);
        const data = new CursorChangeFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        transaction.setCursorFile(data);

        return this.AddTransaction(transaction);
    }

    public ScrollFile(timeOffset: number, file: string, scrollStart: number, scrollEnd: number) {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.SCROLLFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(file);
        const data = new ScrollFileData();
        data.setScrollStart(scrollStart);
        data.setScrollEnd(scrollEnd);
        transaction.setScrollFile(data);

        return this.AddTransaction(transaction);
    }

    public MouseMove(timeOffset: number, x: number, y: number) {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.MOUSEMOVE);
        transaction.setTimeOffsetMs(timeOffset);
        const data = new MouseMoveData();
        data.setX(x);
        data.setY(y);
        transaction.setMouseMove(data);

        return this.AddTransaction(transaction);
    }

    public PreviewAction(timeOffset: number, previewFile: string, currentFile: string) {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CUSTOMACTION);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(currentFile);
        const data = new CustomActionData();
        data.setAction('previewFile');
        data.setData(previewFile);
        transaction.setCustomAction(data);

        this.lastPreviewPath = previewFile;

        return this.AddTransaction(transaction);
    }

    public PreviewCloseAction(timeOffset: number, currentFile: string) {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CUSTOMACTION);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(currentFile);
        const data = new CustomActionData();
        data.setAction('previewFileclose');
        data.setData(this.lastPreviewPath);
        transaction.setCustomAction(data);

        return this.AddTransaction(transaction);
    }

    protected GetSaveableTransactionLogs(force: boolean): TraceTransactionLog[] {
        if (this.transactionLogs.length <= 1 && !force) {
            return null;
        }
        const saveableTransactions = this.transactionLogs.slice(0, force ? this.transactionLogs.length : this.transactionLogs.length - 1);
        return saveableTransactions;
    }

    public async SaveTransactionLogs(force: boolean = false): Promise<boolean> {
        const transactions = this.GetSaveableTransactionLogs(force);
        if (transactions == null) {
            return;
        }
        const result = await this.WriteTransactionLogs(transactions, this.project.getId());
        return result;
    }

    public async WriteTransactionLogs(transactionLogs: TraceTransactionLog[], projectId: string): Promise<boolean> {
        let success = true;
        const savedParts: number[] = [];
        for (const transactionLog of transactionLogs) {
            if (this.savedTransactionLogPartions.indexOf(transactionLog.getPartition(), 0) !== -1) {
                console.log(`Not saving ${transactionLog.getPartition()}`);
                continue;
            }
            const saveResult = await this.SaveTransactionLog(transactionLog, projectId);
            if (saveResult) {
                savedParts.push(transactionLog.getPartition());
            }

            success = success && saveResult;
        }

        const lastTransactionList = transactionLogs[transactionLogs.length - 1].getTransactionsList();
        let lastFinishedPartition = 0;
        if (lastTransactionList.length <= 0) {
            lastFinishedPartition = (transactionLogs[transactionLogs.length - 1].getPartition() / this.project.getPartitionSize()) - 1;
        } else {
            lastFinishedPartition = Math.floor(
                lastTransactionList[lastTransactionList.length - 1].getTimeOffsetMs() / this.project.getPartitionSize()) - 1;
        }

        for (const savedPart of savedParts) {
            if (savedPart > lastFinishedPartition || lastFinishedPartition === -1) {
                continue;
            }

            console.log(`Finished saving ${savedPart} lastFinishedPartition: ${lastFinishedPartition}`);
            this.savedTransactionLogPartions.push(savedPart);
        }

        return success;
    }

    public async SaveTransactionLog(transactionLog: TraceTransactionLog, projectId: string): Promise<boolean> {
        const buffer = transactionLog.serializeBinary();
        // console.log(`saving ${JSON.stringify(transactionLog.toObject())}`);
        return await this.transactionWriter.WriteTransactionLog(transactionLog, buffer, projectId);
    }

    protected GetWriterArgs(): any[] {
        return [this.project];
    }

    protected ThrowIfNotLoaded(): void {
        if (this.project == null) {
            throw new Error('project not loaded');
        }
    }

    public Reset(): void {
        this.savedTransactionLogPartions = new Array<number>();
    }
}
