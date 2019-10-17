import {
    TraceProject,
    TraceTransactionLog,
    TraceTransaction,
    CreateFileData,
    DeleteFileData,
    ModifyFileData,
    EraseFileData
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
        const data = new CreateFileData();
        data.setFilePath(filePath);
        transaction.setCreateFile(data);

        this.AddTransaction(transaction);
    }

    public DeleteFile(timeOffset: number, filePath: string): void {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.DELETEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        const data = new DeleteFileData();
        data.setFilePath(filePath);
        transaction.setDeleteFile(data);

        this.AddTransaction(transaction);
    }

    public ModifyFile(timeOffset: number, filePath: string, line: number, offsetStart: number,
                      offsetEnd: number, insertData: string): void {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.ModifyFile);
        transaction.setTimeOffsetMs(timeOffset);
        const data = new ModifyFileData();
        data.setFilePath(filePath);
        data.setLine(line);
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        data.setData(insertData);
        transaction.setModifyFile(data);

        this.AddTransaction(transaction);
    }

    public EraseFile(timeOffset: number, filePath: string, line: number, offsetStart: number, offsetEnd: number): void {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.ERASEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        const data = new EraseFileData();
        data.setFilePath(filePath);
        data.setLine(line);
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        transaction.setEraseFile(data);

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
