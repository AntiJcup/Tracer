import { ApiHttpRequest } from 'shared/web/lib/ts/ApiHttpRequest';

export class OnlinePreviewGenerator {
    constructor(protected transactionRequestor: ApiHttpRequest) {

    }

    public async GeneratePreview(projectId: string, offsetEnd: number): Promise<string> {
        const response = await this.transactionRequestor
            .Get(`api/project/preview/create?projectId=${projectId}&offsetEnd=${offsetEnd}`);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    }
}
