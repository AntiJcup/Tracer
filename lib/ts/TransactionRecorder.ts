import {
    TraceProject,
    TraceTransactionLog,
    TraceTransaction,
    CreateItemData,
    DeleteItemData,
    ModifyFileData,
    SelectFileData,
    CursorChangeFileData,
    RenameItemData
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

    public get logs(): TraceTransactionLog[] {
        return this.transactionLogs;
    }

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
        this.ThrowIfNotLoaded();
        let transactionLog: TraceTransactionLog = null;
        const partition = PartitionFromOffsetBottom(this.project, timeOffset);
        while (this.transactionLogs.length === 0 || partition !== (this.transactionLogs[this.transactionLogs.length - 1].getPartition())) {
            transactionLog = new TraceTransactionLog();
            transactionLog.setPartition(this.transactionLogs.length);
            this.transactionLogs.push(transactionLog);
            console.log(`Created transaction log ${JSON.stringify(transactionLog.toObject())}`);
        }

        if (transactionLog == null) {
            transactionLog = this.transactionLogs[partition];
        }

        return transactionLog;
    }

    protected AddTransaction(transaction: TraceTransaction): TraceTransaction {
        this.ThrowIfNotLoaded();
        const transactionLog = this.GetTransactionLogByTimeOffset(transaction.getTimeOffsetMs());
        transactionLog.addTransactions(transaction);
        this.project.setDuration(this.project.getDuration() + transaction.getTimeOffsetMs());

        console.log(`Adding transaction ${JSON.stringify(transaction.toObject())} to ${JSON.stringify(transactionLog.toObject())}`);
        return transaction;
    }

    public CreateItem(timeOffset: number, oldFilePath: string, newFilePath: string, isFolder: boolean): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.CREATEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(oldFilePath);
        const data = new CreateItemData();
        data.setIsFolder(isFolder);
        data.setNewFilePath(newFilePath);
        transaction.setCreateFile(data);

        return this.AddTransaction(transaction);
    }

    public DeleteFile(timeOffset: number, filePath: string, previousData: string, isFolder: boolean): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.DELETEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new DeleteItemData();
        data.setPreviousData(previousData);
        data.setIsFolder(isFolder);
        transaction.setDeleteFile(data);

        return this.AddTransaction(transaction);
    }

    public ModifyFile(timeOffset: number, filePath: string, offsetStart: number, offsetEnd: number, insertData: string, previousData?: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.MODIFYFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new ModifyFileData();
        data.setOffsetStart(offsetStart);
        data.setOffsetEnd(offsetEnd);
        data.setData(insertData);
        data.setPreviousData(previousData);
        transaction.setModifyFile(data);

        return this.AddTransaction(transaction);
    }

    public SelectFile(timeOffset: number, oldFilePath: string, newFilePath: string): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.SELECTFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(oldFilePath);
        const data = new SelectFileData();
        data.setNewFilePath(newFilePath);
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

    public RenameFile(timeOffset: number, filePath: string, newFilePath: string, previousData: string, isFolder: boolean): TraceTransaction {
        const transaction = new TraceTransaction();
        transaction.setType(TraceTransaction.TraceTransactionType.RENAMEFILE);
        transaction.setTimeOffsetMs(timeOffset);
        transaction.setFilePath(filePath);
        const data = new RenameItemData();
        data.setNewFilePath(newFilePath);
        data.setPreviousData(previousData);
        data.setIsFolder(isFolder);
        transaction.setRenameFile(data);

        return this.AddTransaction(transaction);
    }

    protected GetSaveableTransactionLogs(force: boolean): TraceTransactionLog[] {
        if (this.transactionLogs.length <= 1) {
            return null;
        }
        const saveableTransactions = this.transactionLogs.slice(0, force ? this.transactionLogs.length : this.transactionLogs.length - 1);
        return saveableTransactions;
    }

    public async SaveTransactionLogs(force: boolean = false): Promise<boolean> {
        const transactions = this.GetSaveableTransactionLogs(force);
        if (transactions == null) {
            return;
        }
        const result = await this.transactionWriter.SaveTransactionLogs(transactions, this.project.getId());
        return result;
    }

    protected GetWriterArgs(): any[] {
        return [this.project];
    }

    protected ThrowIfNotLoaded(): void {
        if (this.project == null) {
            throw new Error('project not loaded');
        }
    }
}
