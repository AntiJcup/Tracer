using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Google.Protobuf;

namespace Tracer
{

    public class TransactionRecorder<TWriter> where TWriter : TransactionWriter
    {
        public TraceProject Project { get; private set; }

        protected UInt32 partitionOffset_ { get; set; } = 0;

        protected List<TraceTransactionLog> logs_ { get; set; }

        protected bool changed_ { get; set; }

        public TransactionRecorder(UInt32 partitionSize)
        {
            Project = new TraceProject()
            {
                Id = Guid.NewGuid().ToString(),
                Duration = 0,
                PartitionSize = partitionSize
            };

            logs_ = new List<TraceTransactionLog>();
        }

        //For loading existing transactions
        //Logs should only be after the offset
        public TransactionRecorder(TraceProject project, List<TraceTransactionLog> transactionLogs, UInt32 partitionOffset)
        {
            Project = project;
            partitionOffset_ = partitionOffset;
            logs_ = transactionLogs;
        }

        protected TraceTransactionLog GetTransactionLogByTimeOffset(int timeOffset)
        {
            TraceTransactionLog transactionLog = null;
            var partition = Project.PartitionFromOffsetBottom(timeOffset);
            while (partition >= (logs_.Count))
            {
                transactionLog = new TraceTransactionLog();
                transactionLog.Partition = partitionOffset_ + (UInt32)(logs_.Count);
                logs_.Add(transactionLog);
            }

            if (transactionLog == null)
            {
                transactionLog = logs_[(int)partition];
            }

            return transactionLog;
        }

        protected void AddTransaction(TraceTransaction transaction)
        {
            var transactionLog = GetTransactionLogByTimeOffset((int)transaction.TimeOffsetMs);
            transactionLog.Transactions.Add(transaction);
            Project.Duration += transaction.TimeOffsetMs;
        }

        public void CreateFile(UInt32 timeOffset, string filePath)
        {
            var transaction = new TraceTransaction();
            transaction.Type = TraceTransaction.Types.TraceTransactionType.CreateFile;
            transaction.TimeOffsetMs = timeOffset;
            transaction.FilePath = filePath;
            var data = new CreateItemData();
            data.IsFolder = false;
            transaction.CreateFile = data;

            AddTransaction(transaction);
        }

        public void DeleteFile(UInt32 timeOffset, string filePath)
        {
            var transaction = new TraceTransaction();
            transaction.Type = TraceTransaction.Types.TraceTransactionType.DeleteFile;
            transaction.TimeOffsetMs = timeOffset;
            transaction.FilePath = filePath;
            var data = new DeleteItemData();
            transaction.DeleteFile = data;

            AddTransaction(transaction);
        }

        public void ModifyFile(UInt32 timeOffset, string filePath, UInt32 offsetStart, UInt32 offsetEnd, string insertData)
        {
            var transaction = new TraceTransaction();
            transaction.Type = TraceTransaction.Types.TraceTransactionType.ModifyFile;
            transaction.TimeOffsetMs = timeOffset;
            transaction.FilePath = filePath;
            var data = new ModifyFileData();
            data.OffsetStart = offsetStart;
            data.OffsetEnd = offsetEnd;
            data.Data = insertData;
            transaction.ModifyFile = data;

            AddTransaction(transaction);
        }
        
        public void SaveChanges()
        {
            var writer = Activator.CreateInstance(typeof(TWriter), GetWriterArgs()) as TWriter;
            writer.SaveProject();
            writer.SaveTransactionLogs(logs_);
        }

        protected virtual object[] GetWriterArgs()
        {
            return new object[] { Project };
        }
    }
}
