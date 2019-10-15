using System;
using System.Collections.Generic;
using System.IO;
using Google.Protobuf;

namespace Tracer
{

    public abstract class TransactionLoader
    {
        public TransactionLoader()
        {
        }

        public TraceTransactionLog LoadTraceTransactionLog(TraceProject project, UInt32 partition)
        {
            TraceTransactionLog traceTransactionLog = null;
            using (var inputStream = GetTransactionLogStream(project, partition))
            {
                if (inputStream == null) return null;
                traceTransactionLog = TraceTransactionLog.Parser.ParseFrom(inputStream);
            }
            return traceTransactionLog;
        }

        public TraceProject LoadProject(Guid id)
        {
            TraceProject traceProject = null;
            using (var inputStream = GetProjectStream(id))
            {
                if (inputStream == null) return null;
                traceProject = TraceProject.Parser.ParseFrom(inputStream);
            }
            return traceProject;
        }

        public List<TraceTransactionLog> GetTransactionLogs(TraceProject project, UInt32 startTime, UInt32 endTime)
        {
            List<TraceTransactionLog> transactionLogs = new List<TraceTransactionLog>();
            var partitionStart = project.PartitionFromOffsetBottom(startTime);
            var partitionEnd = project.PartitionFromOffsetTop(endTime);

            for (var partition = partitionStart; partition <= partitionEnd; partition++)
            {
                var transactionLog = LoadTraceTransactionLog(project, partition);
                if (transactionLog == null) continue;
                transactionLogs.Add(transactionLog);
            }

            return transactionLogs;
        }

        protected abstract Stream GetTransactionLogStream(TraceProject project, UInt32 partition);
        protected abstract Stream GetProjectStream(Guid id);
    }
}
