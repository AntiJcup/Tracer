import { TraceProject } from '../../models/ts/Tracer_pb';

export function PartitionFromOffsetBottom(project: TraceProject, offset: number) {
    return (offset - (offset % project.getPartitionSize())) / project.getPartitionSize();
}

export function PartitionFromOffsetTop(project: TraceProject, offset: number) {
    return (offset + (offset % project.getPartitionSize())) / project.getPartitionSize();
}