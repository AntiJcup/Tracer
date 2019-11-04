
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Tracer;

public abstract class TransactionLoader
{
    protected Dictionary<string, Dictionary<int, TraceTransactionLog>> transactionLogCache = new Dictionary<string, Dictionary<int, TraceTransactionLog>>();

    public TransactionLoader()
    {
    }

    public async Task<TraceTransactionLog> LoadTraceTransactionLog(TraceProject project, int partition)
    {
        Dictionary<int, TraceTransactionLog> projectCache = null;
        if (this.transactionLogCache.ContainsKey(project.Id))
        {
            projectCache = this.transactionLogCache[project.Id];
            if (projectCache != null && projectCache[partition] != null)
            {
                return projectCache[partition];
            }
        }

        TraceTransactionLog traceTransactionLog = TraceTransactionLog.Parser.ParseFrom(await GetTransactionLogStream(project, partition));

        if (projectCache == null)
        {
            projectCache = new Dictionary<int, TraceTransactionLog>();
            this.transactionLogCache[project.Id] = projectCache;
        }
        projectCache[partition] = traceTransactionLog;

        return traceTransactionLog;
    }

    public async Task<ICollection<TraceTransactionLog>> GetTransactionLogs(TraceProject project, int startTime, int endTime)
    {
        var transactionLogs = new List<TraceTransactionLog>();
        var partitions = await GetPartitionsForRange(project, startTime, endTime);


        foreach (var partition in partitions)
        {
            if (!partitions.ContainsKey(partition.Key))
            {
                continue;
            }

            var transactionLog = await this.LoadTraceTransactionLog(project, partition.Value);
            if (transactionLog == null) { continue; }
            transactionLogs.Add(transactionLog);
        }

        return transactionLogs;
    }

    protected abstract Task<Dictionary<string, int>> GetPartitionsForRange(TraceProject project, int startTime, int endTime);
    protected abstract Task<Stream> GetTransactionLogStream(TraceProject project, int partition);
}
