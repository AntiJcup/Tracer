import { TraceProject, TraceTransactionLog } from '../../models/ts/Tracer_pb';

export interface ITransactionWriter {
    // tslint:disable-next-line: max-line-length
    WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array, projectId: string): Promise<boolean>;
}
