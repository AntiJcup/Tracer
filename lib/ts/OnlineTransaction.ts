import { ITransactionWriter } from './ITransactionWriter';
import { TraceTransactionLog, TraceProject, TraceTransactionLogs } from '../../models/ts/Tracer_pb';
import { TransactionLoader } from './TransactionLoader';
import { IProjectWriter } from './IProjectWriter';
import { IProjectReader } from './IProjectReader';
import { ApiHttpRequest } from 'shared/web/lib/ts/ApiHttpRequest';
import { ITransactionReader } from './ITransactionReader';


export class OnlineProjectLoader implements IProjectReader {
    constructor(protected requestor: ApiHttpRequest, protected cacheBuster: string = null) {
    }

    public async GetProject(id: string, cacheBuster: string): Promise<TraceProject> {
        const projectUrlResponse = await this.requestor.Get(`api/project/streaming/project?projectId=${id}`);

        if (!projectUrlResponse.ok) {
            throw new Error('getting project');
        }

        const projectDownloadUrl = (await projectUrlResponse.json()) + (cacheBuster === null ? '' : `?cb=${cacheBuster}`);
        const projectResponse = await this.requestor.GetFullUrl(projectDownloadUrl);

        if (!projectResponse.ok) {
            throw new Error('loading project');
        }

        return TraceProject.deserializeBinary(new Uint8Array(await projectResponse.arrayBuffer()));
    }
}

export class OnlineIProjectWriter implements IProjectWriter {
    constructor(protected requestor: ApiHttpRequest) {
    }

    public async CreateProject(id: string): Promise<boolean> {
        const createResponse = await this.requestor.Post(`api/project/recording/create?tutorialId=${id}`);
        if (!createResponse.ok) {
            return false;
        }

        return true;
    }

    public async ResetProject(id: string): Promise<boolean> {
        const deleteResponse = await this.requestor.Post(`api/project/recording/delete?tutorialId=${id}`);
        if (!deleteResponse.ok) {
            return false;
        }

        return true;
    }
}

export class OnlineITransactionWriter implements ITransactionWriter {
    constructor(protected requestor: ApiHttpRequest, protected tutorialId: string) {
    }

    public async WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array, projectId: string): Promise<boolean> {
        const response = await this.requestor.Post(`api/project/recording/add?projectId=${projectId}`,
            new Blob([data]));

        return response.ok;
    }
}

export class OnlineTransactionReader implements ITransactionReader {
    constructor(protected requestor: ApiHttpRequest, protected cacheBuster: string = null) {
    }

    public async GetPartitionsForRange(
        project: TraceProject,
        startTime: number,
        endTime: number,
        cacheBuster: string): Promise<{ [partition: string]: string }> {

        const response = await this.requestor
            .Get(`api/project/streaming/transactions?projectId=${project.getId()}&offsetStart=${startTime}&offsetEnd=${endTime}${this.cacheBuster === null ?
                '' : `&cb=${this.cacheBuster}`}`);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    public async GetTransactionLog(project: TraceProject, partition: string, cacheBuster: string): Promise<TraceTransactionLog> {
        const response = await this.requestor.GetFullUrl(`${partition}${this.cacheBuster === null ? '' : `?cb=${this.cacheBuster}`}`);

        if (!response.ok) {
            return null;
        }

        return TraceTransactionLog.deserializeBinary(new Uint8Array(await response.arrayBuffer()));
    }
}
