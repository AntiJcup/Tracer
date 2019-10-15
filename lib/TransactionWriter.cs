using System;
using System.Collections.Generic;
using System.IO;
using Google.Protobuf;

namespace Tracer
{

    public abstract class TransactionWriter
    {
        public TraceProject Project { get; private set; }

        //For loading existing transactions
        //Logs should only be after the offset
        public TransactionWriter(TraceProject project)
        {
            Project = project;
        }

        public void SaveProject()
        {
            using (var stream = new MemoryStream())
            {
                Project.WriteTo(stream);
                WriteProject(stream);
            }
        }

        public void SaveTransactionLog(TraceTransactionLog transactionLog)
        {
            using (var stream = new MemoryStream())
            {
                transactionLog.WriteTo(stream);
                WriteTransactionLog(transactionLog, stream);
            }
        }

        public void SaveTransactionLogs(List<TraceTransactionLog> transactionLogs)
        {
            foreach (var transactionLog in transactionLogs)
            {
                using (var stream = new MemoryStream())
                {
                    transactionLog.WriteTo(stream);
                    WriteTransactionLog(transactionLog, stream);
                }
            }
        }

        protected abstract void WriteProject(Stream data);
        protected abstract void WriteTransactionLog(TraceTransactionLog transactionLog, Stream data);
    }
}
