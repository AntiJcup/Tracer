import { TraceProject, TraceTransactionLog } from '../../models/ts/Tracer_pb';

export interface ITransactionReader {
    GetPartitionsForRange(
        project: TraceProject,
        startTime: number,
        endTime: number,
        cacheBuster: string): Promise<{ [partition: string]: string }>;
        
    GetTransactionLog(
        project: TraceProject,
        partition: string,
        cacheBuster: string): Promise<TraceTransactionLog>;
}
