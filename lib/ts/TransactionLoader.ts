import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';

export abstract class TransactionLoader {
    constructor() {
    }

    public LoadTraceTransactionLog(project: TraceProject, partition: number): TraceTransactionLog {
        let traceTransactionLog: TraceTransactionLog = null;
        // TODO read in transaction log
        return traceTransactionLog;
    }

    public LoadProject(id: string): TraceProject {
        let traceProject: TraceProject = null;
        // TODO read in trace project
        return traceProject;
    }

    public GetTransactionLogs(project: TraceProject, startTime: number, endTime: number): TraceTransactionLog[] {
        const transactionLogs: TraceTransactionLog[] = new Array<TraceTransactionLog>();
        const partitionStart = PartitionFromOffsetBottom(project, startTime);
        const partitionEnd = PartitionFromOffsetTop(project, endTime);

        for (let partition = partitionStart; partition <= partitionEnd; partition++) {
            const transactionLog = this.LoadTraceTransactionLog(project, partition);
            if (transactionLog == null) { continue; }
            transactionLogs.push(transactionLog);
        }

        return transactionLogs;
    }

    protected abstract GetTransactionLogStream(project: TraceProject, partition: number): string;
    protected abstract GetProjectStream(id: string): string;
}
