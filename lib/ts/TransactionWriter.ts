import { TraceProject, TraceTransactionLog } from "../../models/ts/Tracer_pb";

export abstract class TransactionWriter {
    constructor(public project: TraceProject) {
    }

    public SaveProject() {
        //TODO
    }

    public SaveTransactionLog(transactionLog: TraceTransactionLog) {
        //TODO
    }

    public SaveTransactionLogs(transactionLogs: TraceTransactionLog[]) {
        //TODO
    }

    protected abstract WriteProject(data: string);
    protected abstract WriteTransactionLog(transactionLog: TraceTransactionLog, data: string);
}
