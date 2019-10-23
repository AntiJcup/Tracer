import { TransactionWriter } from './TransactionWriter';
import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb';
import { TransactionLoader } from './TransactionLoader';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { request } from 'http';

export interface OnlineTransactionRequestInfo {
    host: string;
    credentials: string;
    headers: { [headerName: string]: string };
}

export class OnlineTransactionRequest {
    constructor(public requestInfo: OnlineTransactionRequestInfo) {

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
    protected async GetPartitionsForRange(project: TraceProject, startTime: number, endTime: number): Promise<string[]> {
        const partitions: string[] = [];
        const partitionStart = Math.min(PartitionFromOffsetBottom(project, startTime), project.getDuration() / project.getPartitionSize());
        const partitionEnd = Math.min(PartitionFromOffsetTop(project, endTime), project.getDuration() / project.getPartitionSize());

        for (let partition = partitionStart; partition <= partitionEnd; partition++) {
            partitions.push(partition.toString());
        }

        return partitions;
    }

    protected async GetTransactionLogStream(project: TraceProject, partition: number): Promise<Uint8Array> {
        if (!window.transactionLogCache || !window.transactionLogCache[project.getId()]) {
            return null;
        }
        return window.transactionLogCache[project.getId()][partition];
    }

    protected async GetProjectStream(id: string): Promise<Uint8Array> {
        return window.projectCache[id];
    }
}
