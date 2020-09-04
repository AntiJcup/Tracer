export interface IProjectWriter {
    CreateProject(id: string): Promise<string>;
    ResetProject(id: string): Promise<boolean>;
}
