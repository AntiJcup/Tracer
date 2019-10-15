import { TraceProject, TraceTransactionLog } from '../../models/ts/Tracer_pb';

export abstract class TransactionWriter {
    constructor(public project: TraceProject) {
    }

    public SaveProject(): void {
        const buffer = this.project.serializeBinary();
        this.WriteProject(buffer);
    }

    public SaveTransactionLog(transactionLog: TraceTransactionLog): void {
        const buffer = transactionLog.serializeBinary();
        this.WriteTransactionLog(transactionLog, buffer);
    }

    public SaveTransactionLogs(transactionLogs: TraceTransactionLog[]): void {
        for (const transactionLog of transactionLogs) {
            this.SaveTransactionLog(transactionLog);
        }
    }

    protected abstract WriteProject(data: Uint8Array): void;
    protected abstract WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array): void;
}
