import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { ITransactionReader } from './ITransactionReader';

export class TransactionLoader {
    protected transactionLogCache: { [projectId: string]: { [partition: string]: TraceTransactionLog } } = {};

    constructor(protected transactionReader: ITransactionReader) {
    }

    public async LoadTraceTransactionLog(project: TraceProject, partition: string, cacheBuster: string): Promise<TraceTransactionLog> {
        let projectCache = this.transactionLogCache[project.getId()];
        if (projectCache && projectCache[partition]) {
            return projectCache[partition];
        }

        const traceTransactionLog: TraceTransactionLog = await this.transactionReader.GetTransactionLog(project, partition, cacheBuster);
        // console.log(`Loaded Transaction Log: ${JSON.stringify(traceTransactionLog.toObject())}`);

        if (!projectCache) {
            projectCache = {};
            this.transactionLogCache[project.getId()] = projectCache;
        }
        projectCache[partition] = traceTransactionLog;

        return traceTransactionLog;
    }

    public async GetTransactionLog(
        project: TraceProject,
        partition: string,
        transactionLogs: TraceTransactionLog[],
        cacheBuster: string) {
        const transactionLog = await this.LoadTraceTransactionLog(project, partition, cacheBuster);
        if (transactionLog == null) { return; }
        transactionLogs.push(transactionLog);
    }

    public async GetTransactionLogs(
        project: TraceProject,
        startTime: number,
        endTime: number,
        cacheBuster?: string): Promise<TraceTransactionLog[]> {
        const transactionLogs: TraceTransactionLog[] = new Array<TraceTransactionLog>();
        const partitions = await this.transactionReader.GetPartitionsForRange(project, startTime, endTime, cacheBuster);

        const tasks = [];
        for (const partitionKey in partitions) {
            if (!partitions.hasOwnProperty(partitionKey)) {
                continue;
            }

            const partition = partitions[partitionKey];
            tasks.push(this.GetTransactionLog(project, partition, transactionLogs, cacheBuster));
        }
        await Promise.all(tasks);

        return transactionLogs;
    }
}
