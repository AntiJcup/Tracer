import { TraceProject, TraceTransactionLog, TraceTransaction, CreateFileData, DeleteFileData, InsertFileData, EraseFileData } from "../../models/ts/Tracer_pb";
import { Guid } from "guid-typescript";
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from "./Common";
import { TransactionWriter } from './TransactionWriter'

export class TransactionTracker {
    protected changed_: boolean;

    //For loading existing transactions
    //Logs should only be after the offset
    constructor(public project: TraceProject, private transactionLogs_: TraceTransactionLog[],
        private partitionOffset_: number, private transactionWriter_: TransactionWriter) {
    }

    protected GetTransactionLogByTimeOffset(timeOffset: number): TraceTransactionLog {
        var transactionLog: TraceTransactionLog = null;
        var partition = PartitionFromOffsetBottom(this.project, timeOffset);
        while (partition >= (this.transactionLogs_.length)) {
            transactionLog = new TraceTransactionLog();
            transactionLog.setPartition(this.partitionOffset_ + (this.transactionLogs_.length));
            this.transactionLogs_.push(transactionLog);
        }

        if (transactionLog == null) {
            transactionLog = this.transactionLogs_[partition];
        }

        return transactionLog;
    }

    protected AddTransaction(transaction: TraceTransaction) {
        var transactionLog = this.GetTransactionLogByTimeOffset(transaction.getTimeOffsetMs());
        transactionLog.addTransactions(transaction);
        this.project.setDuration(this.project.getDuration() + transaction.getTimeOffsetMs());
    }

    public CreateFile(timeOffset: number, file_path: string) {
        var transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CREATEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        var data = new CreateFileData();
        data.setFilePath(file_path);
        transaction.setCreateFile(data);

        this.AddTransaction(transaction);
    }

    public DeleteFile(timeOffset: number, file_path: string) {
        var transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.DELETEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        var data = new DeleteFileData();
        data.setFilePath(file_path);
        transaction.setDeleteFile(data);

        this.AddTransaction(transaction);
    }

    public InsertFile(timeOffset: number, file_path: string, line: number, offset: number, insertData: string) {
        var transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.INSERTFILE);
        transaction.setTimeOffsetMs(timeOffset);
        var data = new InsertFileData();
        data.setFilePath(file_path);
        data.setLine(line);
        data.setOffset(offset);
        data.setData(insertData);
        transaction.setInsertFile(data);

        this.AddTransaction(transaction);
    }

    public EraseFile(timeOffset: number, file_path: string, line: number, offsetStart: number, offsetEnd: number) {
        var transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.ERASEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        var data = new EraseFileData();
        data.setFilePath(file_path);
        data.setLine(line);
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        transaction.setEraseFile(data);

        this.AddTransaction(transaction);
    }

    public SaveChanges() {
        this.transactionWriter_.SaveProject();
        this.transactionWriter_.SaveTransactionLogs(this.transactionLogs_);
    }

    protected GetWriterArgs(): any[] {
        return [this.project];
    }
}
