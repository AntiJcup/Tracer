export interface IProjectWriter {
    CreateProject(id: string): Promise<boolean>;
    ResetProject(id: string): Promise<boolean>;
}
