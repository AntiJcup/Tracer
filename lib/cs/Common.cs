namespace Tracer
{
    public static class TraceProjectExtensions
    {
        public static int PartitionFromOffsetBottom(this TraceProject project, int offset)
        {
            return (int)((offset - (offset % project.PartitionSize)) / project.PartitionSize);
        }

        public static int PartitionFromOffsetTop(this TraceProject project, int offset)
        {
            return (int)((offset + (offset % project.PartitionSize)) / project.PartitionSize);
        }
    }
}
