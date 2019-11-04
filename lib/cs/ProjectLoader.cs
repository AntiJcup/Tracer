using System;
using System.IO;
using System.Threading.Tasks;
using Tracer;

public abstract class ProjectLoader
{
    ProjectLoader()
    {
    }

    public async Task<TraceProject> LoadProject(Guid id)
    {
        using (var stream = await this.GetProjectStream(id))
        {
            TraceProject traceProject = TraceProject.Parser.ParseFrom(stream);
            return traceProject;
        }
    }

    protected abstract Task<Stream> GetProjectStream(Guid id);
}
