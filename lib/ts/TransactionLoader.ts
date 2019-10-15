import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';

export abstract class TransactionLoader {
    constructor() {
    }

    public LoadTraceTransactionLog(project: TraceProject, partition: number): TraceTransactionLog {
        const traceTransactionLog: TraceTransactionLog = TraceTransactionLog.deserializeBinary(
            this.GetTransactionLogStream(project, partition));
        return traceTransactionLog;
    }

    public LoadProject(id: string): TraceProject {
        const traceProject: TraceProject = TraceProject.deserializeBinary(this.GetProjectStream(id));
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

    protected abstract GetTransactionLogStream(project: TraceProject, partition: number): Uint8Array;
    protected abstract GetProjectStream(id: string): Uint8Array;
}
