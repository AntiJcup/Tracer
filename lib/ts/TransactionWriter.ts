import { TraceProject, TraceTransactionLog } from '../../models/ts/Tracer_pb';

export abstract class TransactionWriter {
    private savedTransactionLogPartions: number[] = new Array<number>();

    constructor(public project: TraceProject) {
    }

    public async SaveTransactionLog(transactionLog: TraceTransactionLog): Promise<boolean> {
        const buffer = transactionLog.serializeBinary();
        return await this.WriteTransactionLog(transactionLog, buffer);
    }

    public async SaveTransactionLogs(transactionLogs: TraceTransactionLog[]): Promise<boolean> {
        let success = false;
        for (const transactionLog of transactionLogs) {
            if (this.savedTransactionLogPartions.indexOf(transactionLog.getPartition(), 0) !== -1) {
                continue;
            }
            const saveResult = await this.SaveTransactionLog(transactionLog);
            if (saveResult) {
                this.savedTransactionLogPartions.push(transactionLog.getPartition());
            }

            success = success && saveResult;
        }

        return success;
    }

    protected async abstract WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array): Promise<boolean>;
}
