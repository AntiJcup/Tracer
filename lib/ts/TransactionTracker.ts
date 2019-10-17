import {
    TraceProject,
    TraceTransactionLog,
    TraceTransaction,
    CreateFileData,
    DeleteFileData,
    ModifyFileData
} from '../../models/ts/Tracer_pb';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { TransactionWriter } from './TransactionWriter';

export class TransactionTracker {
    // tslint:disable-next-line: variable-name
    protected changed: boolean;

    constructor(public project: TraceProject, private transactionLogs: TraceTransactionLog[],
                private partitionOffset: number, private transactionWriter: TransactionWriter) {
    }

    protected GetTransactionLogByTimeOffset(timeOffset: number): TraceTransactionLog {
        let transactionLog: TraceTransactionLog = null;
        const partition = PartitionFromOffsetBottom(this.project, timeOffset);
        while (partition >= (this.transactionLogs.length)) {
            transactionLog = new TraceTransactionLog();
            transactionLog.setPartition(this.partitionOffset + (this.transactionLogs.length));
            this.transactionLogs.push(transactionLog);
        }

        if (transactionLog == null) {
            transactionLog = this.transactionLogs[partition];
        }

        return transactionLog;
    }

    protected AddTransaction(transaction: TraceTransaction): void {
        const transactionLog = this.GetTransactionLogByTimeOffset(transaction.getTimeOffsetMs());
        transactionLog.addTransactions(transaction);
        this.project.setDuration(this.project.getDuration() + transaction.getTimeOffsetMs());
    }

    public CreateFile(timeOffset: number, filePath: string): void {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CREATEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new CreateFileData();
        transaction.setCreateFile(data);

        this.AddTransaction(transaction);
    }

    public DeleteFile(timeOffset: number, filePath: string): void {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.DELETEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new DeleteFileData();
        transaction.setDeleteFile(data);

        this.AddTransaction(transaction);
    }

    public ModifyFile(timeOffset: number, filePath: string, offsetStart: number,
                      offsetEnd: number, insertData: string): void {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.MODIFYFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new ModifyFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        data.setData(insertData);
        transaction.setModifyFile(data);

        this.AddTransaction(transaction);
    }

    public SaveChanges(): void {
        this.transactionWriter.SaveProject();
        this.transactionWriter.SaveTransactionLogs(this.transactionLogs);
    }

    protected GetWriterArgs(): any[] {
        return [this.project];
    }
}
