using System;
using System.Collections.Generic;
using System.IO;
using Google.Protobuf;

namespace Tracer
{

    public class LocalConstants
    {
        public static readonly string LocalProjectFolder = "{0}_proj";
        public static readonly string LocalPartitionsFolder = "partitions";
        public static readonly string LocalTransactionLogNameFormat = "{0}.tlc";
        public static readonly string LocalProjectNameFormat = "proj.tpc";
    }

    public class LocalTransactionLoader : TransactionLoader
    {
        public string ProjectDir { get; private set; }

        public LocalTransactionLoader(string projectDir) : base()
        {
            ProjectDir = projectDir;
        }

        override protected Stream GetTransactionLogStream(TraceProject project, UInt32 partition)
        {
            var filePath = Path.Combine(ProjectDir, string.Format(LocalConstants.LocalProjectFolder, project.Id), LocalConstants.LocalPartitionsFolder,
                string.Format(LocalConstants.LocalTransactionLogNameFormat, partition.ToString()));
            if (!File.Exists(filePath))
            {
                return null;
            }
            return File.OpenRead(filePath);
        }

        override protected Stream GetProjectStream(Guid id)
        {
            var filePath = Path.Combine(ProjectDir, string.Format(LocalConstants.LocalProjectFolder, id), string.Format(LocalConstants.LocalProjectNameFormat, id.ToString()));
            return File.OpenRead(filePath);
        }
    }

    public class LocalTransactionWriter : TransactionWriter
    {
        public string ProjectDir { get; private set; }

        public LocalTransactionWriter(TraceProject project, string projectDir) : base(project)
        {
            ProjectDir = projectDir;
        }

        override protected void WriteProject(Stream data)
        {
            var projectPath = Path.Combine(ProjectDir, string.Format(LocalConstants.LocalProjectFolder, Project.Id));
            if (!Directory.Exists(projectPath))
            {
                Directory.CreateDirectory(projectPath);
            }

            var filePath = Path.Combine(projectPath, string.Format(LocalConstants.LocalProjectNameFormat, Project.Id));
            using (var fileStream = File.Create(filePath))
            {
                data.Position = 0;
                data.CopyTo(fileStream);
            }
        }

        override protected void WriteTransactionLog(TraceTransactionLog transactionLog, Stream data)
        {
            var projectPath = Path.Combine(ProjectDir, string.Format(LocalConstants.LocalProjectFolder, Project.Id));
            if (!Directory.Exists(projectPath))
            {
                Directory.CreateDirectory(projectPath);
            }

            var partitionsFolderPath = Path.Combine(projectPath, LocalConstants.LocalPartitionsFolder);
            if (!Directory.Exists(partitionsFolderPath))
            {
                Directory.CreateDirectory(partitionsFolderPath);
            }

            var filePath = Path.Combine(partitionsFolderPath,
                string.Format(LocalConstants.LocalTransactionLogNameFormat, transactionLog.Partition.ToString()));
            using (var fileStream = File.Create(filePath))
            {
                data.Position = 0;
                data.CopyTo(fileStream);
            }
        }
    }

    public class LocalTransactionTracker : TransactionTracker<LocalTransactionWriter>
    {
        public string ProjectDir { get; private set; }

        public LocalTransactionTracker(UInt32 partitionSize, string projectDir) : base(partitionSize)
        {
            ProjectDir = projectDir;
        }

        override protected object[] GetWriterArgs()
        {
            return new object[] { Project, ProjectDir };
        }
    }
}
