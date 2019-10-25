import { TransactionWriter } from './TransactionWriter';
import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { TransactionLoader } from './TransactionLoader';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { request } from 'http';
import { promise } from 'protractor';

export interface OnlineTransactionRequestInfo {
    host: string;
    credentials: string;
    headers: { [headerName: string]: string };
}

export class OnlineTransactionRequest {
    constructor(public requestInfo: OnlineTransactionRequestInfo) {

    }
    public async GetFullUrl(url: string): Promise<Response> {
        return await fetch(url, this.generateRequestInfo('GET'));
    }

    public async Get(path: string): Promise<Response> {
        return await fetch(`${this.requestInfo.host}/${path}`, this.generateRequestInfo('GET'));
    }

    public async Post(path: string, body?: any, requestHeaders?: { [headerName: string]: string }): Promise<Response> {
        return await fetch(`${this.requestInfo.host}/${path}`, this.generateRequestInfo('POST', body, requestHeaders));
    }

    protected generateRequestInfo(requestMethod: string, requestBody?: any, requestHeaders?: { [headerName: string]: string }): any {
        return {
            method: requestMethod,
            credentials: this.requestInfo.credentials,
            headers: { ...this.requestInfo.headers, ...requestHeaders }, // merge the dictionaries
            body: requestBody
        };
    }
}

export class OnlineTransactionWriter extends TransactionWriter {
    constructor(protected transactionRequestor: OnlineTransactionRequest, protected tutorialId: string, traceProject: TraceProject) {
        super(traceProject);
    }

    protected async WriteProject(data: Uint8Array): Promise<boolean> {
        const response = await this.transactionRequestor.Post(`api/Recording/CreateProject?tutorialId=${this.tutorialId}`);
        if (!response.ok) {
            return false;
        }
        const responseJson = await response.json();
        this.project.setId(responseJson.id);
        this.project.setPartitionSize(responseJson.partitionSize);
        return true;
    }

    protected async WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array): Promise<boolean> {
        const response = await this.transactionRequestor.Post(`api/Recording/AddTransactionLog?projectId=${this.project.getId()}`,
            new Blob([data]));

        return response.ok;
    }
}

export class OnlineTransactionLoader extends TransactionLoader {
    constructor(protected transactionRequestor: OnlineTransactionRequest) {
        super();
    }

    protected async GetPartitionsForRange(
        project: TraceProject,
        startTime: number,
        endTime: number): Promise<{ [partition: string]: string }> {
        const cappedEndTime = Math.min(project.getDuration(), endTime);

        const response = await this.transactionRequestor
            .Get(`api/Streaming/GetTransactionLogUrls?projectId=${project.getId()}&offsetStart=${startTime}&offsetEnd=${cappedEndTime}`);

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

    protected async GetProjectStream(id: string): Promise<Uint8Array> {
        const projectUrlResponse = await this.transactionRequestor.Get(`api/Streaming/GetProjectUrl?projectId=${id}`);

        if (!projectUrlResponse.ok) {
            return null;
        }
        const projectResponse =  await this.transactionRequestor.GetFullUrl(await projectUrlResponse.json());

        return new Uint8Array(await projectResponse.arrayBuffer());
    }
}
