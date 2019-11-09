import { TransactionWriter } from './TransactionWriter';
import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { TransactionLoader } from './TransactionLoader';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { request } from 'http';
import { promise } from 'protractor';
import { ProjectWriter } from './ProjectWriter';
import { ProjectLoader } from './ProjectLoader';
import { ApiHttpRequest } from 'shared/web/lib/ts/ApiHttpRequest';


export class OnlineProjectLoader extends ProjectLoader {
    constructor(protected transactionRequestor: ApiHttpRequest) {
        super();
    }

    public async GetProjectStream(id: string): Promise<Uint8Array> {
        const projectUrlResponse = await this.transactionRequestor.Get(`api/project/streaming/project?projectId=${id}`);

        if (!projectUrlResponse.ok) {
            throw new Error('Error getting project');
        }
        const projectResponse = await this.transactionRequestor.GetFullUrl(await projectUrlResponse.json());

        if (!projectResponse.ok) {
            throw new Error('Error downloading project');
        }

        return new Uint8Array(await projectResponse.arrayBuffer());
    }
}

export class OnlineProjectWriter extends ProjectWriter {
    constructor(protected transactionRequestor: ApiHttpRequest) {
        super();
    }

    public async CreateProject(id: string): Promise<boolean> {
        const createResponse = await this.transactionRequestor.Post(`api/project/recording/create?tutorialId=${id}`);
        if (!createResponse.ok) {
            return false;
        }

        return true;
    }

    public async DeleteProject(id: string): Promise<boolean> {
        const deleteResponse = await this.transactionRequestor.Post(`api/project/recording/delete?tutorialId=${id}`);
        if (!deleteResponse.ok) {
            return false;
        }

        return true;
    }
}

export class OnlineTransactionWriter extends TransactionWriter {
    constructor(protected transactionRequestor: ApiHttpRequest, protected tutorialId: string) {
        super(tutorialId);
    }

    protected async WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array): Promise<boolean> {
        const response = await this.transactionRequestor.Post(`api/project/recording/add?projectId=${this.projectId}`,
            new Blob([data]));

        return response.ok;
    }
}

export class OnlineTransactionLoader extends TransactionLoader {
    constructor(protected transactionRequestor: ApiHttpRequest) {
        super();
    }

    protected async GetPartitionsForRange(
        project: TraceProject,
        startTime: number,
        endTime: number): Promise<{ [partition: string]: string }> {
        const cappedEndTime = Math.min(project.getDuration(), endTime);

        const response = await this.transactionRequestor
            .Get(`api/project/streaming/transactions?projectId=${project.getId()}&offsetStart=${startTime}&offsetEnd=${cappedEndTime}`);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    protected async GetTransactionLogStream(project: TraceProject, partition: string): Promise<Uint8Array> {
        const response = await this.transactionRequestor.GetFullUrl(partition);

        if (!response.ok) {
            return null;
        }

        return new Uint8Array(await response.arrayBuffer());
    }
}
