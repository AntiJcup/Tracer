import { TraceProject, TraceTransactionLog } from '../../models/ts/Tracer_pb';

export abstract class TransactionWriter {
    private savedTransactionLogPartions: number[] = new Array<number>();

    constructor() {
    }

    public Reset(): void {
        this.savedTransactionLogPartions = new Array<number>();
    }

    public async SaveTransactionLog(transactionLog: TraceTransactionLog, projectId: string): Promise<boolean> {
        const buffer = transactionLog.serializeBinary();
        console.log(`saving ${JSON.stringify(transactionLog.toObject())}`);
        return await this.WriteTransactionLog(transactionLog, buffer, projectId);
    }

    public async SaveTransactionLogs(transactionLogs: TraceTransactionLog[], projectId: string): Promise<boolean> {
        let success = true;
        for (const transactionLog of transactionLogs) {
            if (this.savedTransactionLogPartions.indexOf(transactionLog.getPartition(), 0) !== -1) {
                continue;
            }
            const saveResult = await this.SaveTransactionLog(transactionLog, projectId);
            if (saveResult) {
                this.savedTransactionLogPartions.push(transactionLog.getPartition());
            }

            success = success && saveResult;
        }

        return success;
    }

    // tslint:disable-next-line: max-line-length
    protected async abstract WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array, projectId: string): Promise<boolean>;
}
