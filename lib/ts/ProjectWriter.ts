import { TraceProject, TraceTransactionLog } from '../../models/ts/Tracer_pb';

export abstract class ProjectWriter {
    constructor() {
    }

    public async abstract CreateProject(id: string): Promise<boolean>;

    public async abstract DeleteProject(id: string): Promise<boolean>;
}
