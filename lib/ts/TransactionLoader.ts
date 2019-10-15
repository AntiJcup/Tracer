import { TraceTransactionLog, TraceProject } from "../../models/ts/Tracer_pb";
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from "./Common";

export abstract class TransactionLoader {
    constructor() {
    }

    public LoadTraceTransactionLog(project: TraceProject, partition: number): TraceTransactionLog {
        var traceTransactionLog: TraceTransactionLog = null;
        //TODO read in transaction log
        return traceTransactionLog;
    }

    public LoadProject(id: string): TraceProject {
        var traceProject: TraceProject = null;
        //TODO read in trace project
        return traceProject;
    }

    public GetTransactionLogs(project: TraceProject, startTime: number, endTime: number): TraceTransactionLog[] {
        var transactionLogs: TraceTransactionLog[] = new Array<TraceTransactionLog>();
        var partitionStart = PartitionFromOffsetBottom(project, startTime);
        var partitionEnd = PartitionFromOffsetTop(project, endTime);

        for (var partition = partitionStart; partition <= partitionEnd; partition++) {
            var transactionLog = this.LoadTraceTransactionLog(project, partition);
            if (transactionLog == null) continue;
            transactionLogs.push(transactionLog);
        }

        return transactionLogs;
    }

    protected abstract GetTransactionLogStream(project: TraceProject, partition: number): string;
    protected abstract GetProjectStream(id: string): string;
}
