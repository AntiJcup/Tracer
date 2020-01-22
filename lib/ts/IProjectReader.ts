import { TraceProject } from '../../models/ts/Tracer_pb';

export interface IProjectReader {
    GetProject(id: string, cacheBuster: string): Promise<TraceProject>;
}
