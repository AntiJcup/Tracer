import { TransactionWriter } from './TransactionWriter'
import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb'
import { TransactionLoader } from './TransactionLoader';

declare global {
    interface Window {
        projectCache: Map<string, Uint8Array>;
        transactionLogCache: Map<string, Map<number, Uint8Array>>;
    }
}

export class LocalTransactionWriter extends TransactionWriter {

    protected WriteProject(data: Uint8Array): void {
        if (window.projectCache == null) {
            window.projectCache = new Map<string, Uint8Array>();
        }

        window.projectCache[this.project.getId()] = data;
    }

    protected WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array): void {
        if (window.transactionLogCache == null) {
            window.transactionLogCache = new Map<string, Map<number, Uint8Array>>();
        }

        if (window.transactionLogCache[this.project.getId()] == null) {
            window.transactionLogCache[this.project.getId()] = new Map<number, Uint8Array>();
        }

        window.transactionLogCache[this.project.getId()][transactionLog.getPartition()] = data;
    }
}

export class LocalTransactionLoader extends TransactionLoader {
    protected GetTransactionLogStream(project: TraceProject, partition: number): Uint8Array {
        if (!window.transactionLogCache || !window.transactionLogCache[project.getId()]) {
            return null;
        }
        return window.transactionLogCache[project.getId()][partition];
    }

    protected GetProjectStream(id: string): Uint8Array {
        return window.projectCache[id];
    }


}