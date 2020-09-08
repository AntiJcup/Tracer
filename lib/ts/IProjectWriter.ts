export interface IProjectWriter {
    CreateProject(): Promise<string>;
    ResetProject(id: string): Promise<boolean>;
}
