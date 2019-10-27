import { TransactionWriter } from './TransactionWriter'
import { TraceTransactionLog, TraceProject } from '../../models/ts/Tracer_pb'
import { TransactionLoader } from './TransactionLoader';
import { PartitionFromOffsetBottom, PartitionFromOffsetTop } from './Common';
import { ProjectWriter } from './ProjectWriter';
import { ProjectLoader } from './ProjectLoader';

declare global {
    interface Window {
        projectCache: Map<string, Uint8Array>;
        transactionLogCache: Map<string, Map<number, Uint8Array>>;
    }
}

export class LocalProjectLoader extends ProjectLoader {
    constructor() {
        super();
    }

    public async GetProjectStream(id: string): Promise<Uint8Array> {
        return window.projectCache[id];
    }
}

export class LocalProjectWriter extends ProjectWriter {
    constructor() {
        super();
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

    public async DeleteProject(id: string): Promise<boolean> {
        delete window.projectCache[id];

        return true;
    }
}

export class LocalTransactionWriter extends TransactionWriter {
    protected async WriteTransactionLog(transactionLog: TraceTransactionLog, data: Uint8Array): Promise<boolean> {
        if (window.transactionLogCache == null) {
            window.transactionLogCache = new Map<string, Map<number, Uint8Array>>();
        }

        if (window.transactionLogCache[this.projectId] == null) {
            window.transactionLogCache[this.projectId] = new Map<number, Uint8Array>();
        }

        window.transactionLogCache[this.projectId][transactionLog.getPartition()] = data;

        const project = await (new LocalProjectLoader()).LoadProject(this.projectId);
        const currentDuration = project.getDuration();
        const newDuration = transactionLog.getPartition() * project.getPartitionSize();
        if (currentDuration < newDuration) {
            project.setDuration(newDuration);
            window.projectCache[this.projectId] = project.serializeBinary();
        }

        return true;
    }
}

export class LocalTransactionLoader extends TransactionLoader {
    protected async GetPartitionsForRange(
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

    protected async GetTransactionLogStream(project: TraceProject, partition: string): Promise<Uint8Array> {
        if (!window.transactionLogCache || !window.transactionLogCache[project.getId()]) {
            return null;
        }
        return window.transactionLogCache[project.getId()][partition];
    }
}
