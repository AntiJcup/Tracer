import { TraceProject } from '../../models/ts/Tracer_pb';

export abstract class ProjectLoader {
    constructor() {
    }

    public async LoadProject(id: string): Promise<TraceProject> {
        const traceProject: TraceProject = TraceProject.deserializeBinary(await this.GetProjectStream(id));

        return traceProject;
    }

    protected abstract async GetProjectStream(id: string): Promise<Uint8Array>;
}
