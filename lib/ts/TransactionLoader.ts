import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';

export abstract class TransactionLoader {
    protected transactionLogCache: { [projectId: string]: { [partition: string]: TraceTransactionLog } } = {};

    constructor() {
    }

    public async LoadTraceTransactionLog(project: TraceProject, partition: string): Promise<TraceTransactionLog> {
        let projectCache = this.transactionLogCache[project.getId()];
        if (projectCache && projectCache[partition]) {
            return projectCache[partition];
        }

        const traceTransactionLog: TraceTransactionLog = TraceTransactionLog.deserializeBinary(
            await this.GetTransactionLogStream(project, partition));
        console.log(`Loaded Transaction Log: ${JSON.stringify(traceTransactionLog.toObject())}`);

        if (!projectCache) {
            projectCache = {};
            this.transactionLogCache[project.getId()] = projectCache;
        }
        projectCache[partition] = traceTransactionLog;

        return traceTransactionLog;
    }

    public async GetTransactionLog(project: TraceProject, partition: string, transactionLogs: TraceTransactionLog[]) {
        const transactionLog = await this.LoadTraceTransactionLog(project, partition);
        if (transactionLog == null) { return; }
        transactionLogs.push(transactionLog);
    }

    public async GetTransactionLogs(project: TraceProject, startTime: number, endTime: number): Promise<TraceTransactionLog[]> {
        const transactionLogs: TraceTransactionLog[] = new Array<TraceTransactionLog>();
        const partitions = await this.GetPartitionsForRange(project, startTime, endTime);

        const tasks = [];
        for (const partitionKey in partitions) {
            if (!partitions.hasOwnProperty(partitionKey)) {
                continue;
            }

            const partition = partitions[partitionKey];
            await this.GetTransactionLog(project, partition, transactionLogs);
            // tasks.push();
        }
        // await Promise.all(tasks);

        return transactionLogs;
    }

    protected abstract async GetPartitionsForRange(
        project: TraceProject,
        startTime: number,
        endTime: number): Promise<{ [partition: string]: string }>;
    protected abstract async GetTransactionLogStream(project: TraceProject, partition: string): Promise<Uint8Array>;
}
