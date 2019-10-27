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
import { PartitionFromOffsetBottom } from './Common';
import { TransactionWriter } from './TransactionWriter';
import { ProjectLoader } from './ProjectLoader';
import { ProjectWriter } from './ProjectWriter';
import { Guid } from 'guid-typescript';

export class TransactionRecorder {
    protected changed: boolean;
    protected project: TraceProject;
    private initialTimeOffset = 0;

    constructor(
        private id: string,
        private projectLoader: ProjectLoader,
        private projectWriter: ProjectWriter,
        private transactionWriter: TransactionWriter,
        private transactionLogs: TraceTransactionLog[] = []) {

    }

    // Call this if you are starting a new recording session
    public async New(): Promise<void> {
        this.project = await this.CreateProject(this.id);

        if (!this.project) {
            throw new Error('Failed to load project id: ' + this.id);
        }
    }

    // Call this if you are loading an existing recording session
    public async Load(): Promise<void> {
        this.project = await this.LoadProject(this.id);

        if (!this.project) {
            throw new Error('Failed to load project id: ' + this.id);
        }
    }

    public async CreateProject(id: string): Promise<TraceProject> {
        const result = await this.projectWriter.CreateProject(id);
        if (!result) {
            throw new Error('Failed to create project id: ' + id);
        }

        return await this.LoadProject(id);
    }

    public async LoadProject(id: string): Promise<TraceProject> {
        return await this.projectLoader.LoadProject(this.id);
    }

    public async DeleteProject(id: string): Promise<boolean> {
        return await this.projectWriter.DeleteProject(id);
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
