import { ITransactionWriter } from './ITransactionWriter'
import { TraceTransactionLog, TraceProject, TraceTransactionLogs } from '../../models/ts/Tracer_pb'
import { TransactionLoader } from './TransactionLoader';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { IProjectWriter } from './IProjectWriter';
import { IProjectReader } from './IProjectReader';
import { ITransactionReader } from './ITransactionReader';

declare global {
    interface Window {
        projectCache: Map<string, Uint8Array>;
        transactionLogCache: Map<string, Map<number, Uint8Array>>;
    }
}

export class LocalProjectLoader implements IProjectReader {
    constructor() {
    }

    public async GetProject(id: string): Promise<TraceProject> {
        return TraceProject.deserializeBinary(new Uint8Array(window.projectCache[id]));
    }
}

export class LocalProjectWriter implements IProjectWriter {
    constructor() {
    }

    public async CreateProject(id: string): Promise<boolean> {
        if (window.projectCache == null) {
            window.projectCache = new Map<string, Uint8Array>();
        }

        const newProject = new TraceProject();
        newProject.setDuration(0);
        newProject.setPartitionSize(5000);
        newProject.setId(id);

        window.projectCache[id] = newProject.serializeBinary();

        return true;
    }

    public async ResetProject(id: string): Promise<boolean> {
        if (!window.projectCache) {
            return true;
        }
        delete window.projectCache[id];

        return true;
    }
}

export class LocalTransactionWriter implements ITransactionWriter {
    public async WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array, projectId: string): Promise<boolean> {
        if (window.transactionLogCache == null) {
            window.transactionLogCache = new Map<string, Map<number, Uint8Array>>();
        }

        if (window.transactionLogCache[projectId] == null) {
            window.transactionLogCache[projectId] = new Map<number, Uint8Array>();
        }

        window.transactionLogCache[projectId][transactionLog.getPartition()] = data;

        const project = await (new LocalProjectLoader()).GetProject(projectId);
        const currentDuration = project.getDuration();
        const newDuration = transactionLog.getPartition() * project.getPartitionSize();
        if (currentDuration < newDuration) {
            project.setDuration(newDuration);
            window.projectCache[projectId] = project.serializeBinary();
        }

        return true;
    }
}

export class LocalTransactionReader implements ITransactionReader {
    public async GetPartitionsForRange(
        project: TraceProject,
        startTime: number,
        endTime: number): Promise<{ [partition: string]: string }> {
        const partitions: { [partition: string]: string } = {};
        const partitionStart = Math.min(PartitionFromOffsetBottom(project, startTime), project.getDuration() / project.getPartitionSize());
        const partitionEnd = Math.min(PartitionFromOffsetTop(project, endTime), project.getDuration() / project.getPartitionSize());

        for (let partition = partitionStart; partition <= partitionEnd; partition++) {
            partitions[partition] = partition.toString();
        }

        return partitions;
    }

    public async GetTransactionLog(project: TraceProject, partition: string): Promise<TraceTransactionLog> {
        if (!window.transactionLogCache || !window.transactionLogCache[project.getId()]) {
            return null;
        }

        return TraceTransactionLog.deserializeBinary(new Uint8Array(window.transactionLogCache[project.getId()][partition]));
    }
}
