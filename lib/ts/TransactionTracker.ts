import {
    TraceProject,
    TraceTransactionLog,
    TraceTransaction,
    CreateFileData,
    DeleteFileData,
    ModifyFileData,
    SelectFileData,
    CursorChangeFileData,
    RenameFileData
} from '../../models/ts/Tracer_pb';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { TransactionWriter } from './TransactionWriter';

export class TransactionTracker {
    // tslint:disable-next-line: variable-name
    protected changed: boolean;

    constructor(
        public project: TraceProject,
        private transactionWriter: TransactionWriter,
        private transactionLogs: TraceTransactionLog[] = [],
        private partitionOffset: number = 0) {
    }

    public GetTransactionLogByTimeOffset(timeOffset: number): TraceTransactionLog {
        let transactionLog: TraceTransactionLog = null;
        const partition = PartitionFromOffsetBottom(this.project, timeOffset);
        if (this.transactionLogs.length === 0 || partition >= (this.transactionLogs[this.transactionLogs.length - 1].getPartition())) {
            transactionLog = new TraceTransactionLog();
            transactionLog.setPartition(partition);
            this.transactionLogs.push(transactionLog);
        }

        if (transactionLog == null) {
            transactionLog = this.transactionLogs[partition];
        }

        return transactionLog;
    }

    protected AddTransaction(transaction: TraceTransaction): TraceTransaction {
        const transactionLog = this.GetTransactionLogByTimeOffset(transaction.getTimeOffsetMs());
        transactionLog.addTransactions(transaction);
        this.project.setDuration(this.project.getDuration() + transaction.getTimeOffsetMs());
        return transaction;
    }

    public CreateFile(timeOffset: number, filePath: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CREATEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new CreateFileData();
        transaction.setCreateFile(data);

        return this.AddTransaction(transaction);
    }

    public DeleteFile(timeOffset: number, filePath: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.DELETEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new DeleteFileData();
        transaction.setDeleteFile(data);

        return this.AddTransaction(transaction);
    }

    public ModifyFile(timeOffset: number, filePath: string, offsetStart: number, offsetEnd: number, insertData: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.MODIFYFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new ModifyFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        data.setData(insertData);
        transaction.setModifyFile(data);

        return this.AddTransaction(transaction);
    }

    public SelectFile(timeOffset: number, filePath: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.SELECTFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new SelectFileData();
        transaction.setSelectFile(data);

        return this.AddTransaction(transaction);
    }

    public CursorFocusChangeFile(timeOffset: number, filePath: string, offsetStart: number, offsetEnd: number): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CURSORFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new CursorChangeFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        transaction.setCursorFile(data);

        return this.AddTransaction(transaction);
    }

    public RenameFile(timeOffset: number, filePath: string, newFilePath: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CURSORFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new RenameFileData();
        data.setNewFilePath(filePath);
        transaction.setRenameFile(data);

        return this.AddTransaction(transaction);
    }

    protected GetSaveableTransactionLogs(): TraceTransactionLog[] {
        if (this.transactionLogs.length <= 1) {
            return null;
        }
        const saveableTransactions = this.transactionLogs.slice(0, this.transactionLogs.length - 1);
        return saveableTransactions;
    }

    public async SaveTransactionLogs(): Promise<boolean> {
        const transactions = this.GetSaveableTransactionLogs();
        if (transactions == null) {
            return;
        }
        const result = await this.transactionWriter.SaveTransactionLogs(this.transactionLogs);
        return result;
    }

    protected GetWriterArgs(): any[] {
        return [this.project];
    }
}
