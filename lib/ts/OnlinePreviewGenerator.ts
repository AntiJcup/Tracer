import { ApiHttpRequest } from 'shared/web/lib/ts/ApiHttpRequest';
import { TraceTransactionLog, TraceTransactionLogs } from 'shared/Tracer/models/ts/Tracer_pb';

export class OnlinePreviewGenerator {
    constructor(protected transactionRequestor: ApiHttpRequest) {

    }

    public async LoadPreview(projectId: string, offsetEnd: number): Promise<string> {
        const response = await this.transactionRequestor
            .Get(`api/project/preview/load?projectId=${projectId}&offsetEnd=${offsetEnd}`);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    public async GeneratePreview(projectId: string, offsetEnd: number, logs: TraceTransactionLog[], baseProject?: string): Promise<string> {
        const uploadLogs: TraceTransactionLogs = new TraceTransactionLogs();
        uploadLogs.setLogsList(logs);
        const buffer = uploadLogs.serializeBinary();
        const response = await this.transactionRequestor
            .Post(`api/project/preview/generate?projectId=${projectId}&offsetEnd=${offsetEnd}${baseProject ? `&baseProjectId=${baseProject}` : ''}`,
                new Blob([buffer]));

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }

    public async DownloadPreview(projectId: string, offsetEnd: number, logs: TraceTransactionLog[], baseProject?: string): Promise<void> {
        const uploadLogs: TraceTransactionLogs = new TraceTransactionLogs();
        uploadLogs.setLogsList(logs);
        const buffer = uploadLogs.serializeBinary();
        const response = await this.transactionRequestor
            // tslint:disable-next-line: max-line-length
            .Post(`api/project/preview/download?projectId=${projectId}&offsetEnd=${offsetEnd}${baseProject ? `&baseProjectId=${baseProject}` : ''}`,
                new Blob([buffer]));

        if (!response.ok) {
            throw new Error('Failed generating download url for preview');
        }

        const downloadUrl = await response.json();
        if (!downloadUrl) {
            throw new Error('Bad download url for preview');
        }

        window.location.href = downloadUrl;
    }
}
