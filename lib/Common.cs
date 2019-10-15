using System;
using System.Collections.Generic;
using System.IO;
using Google.Protobuf;

namespace Tracer
{
    public static class TraceProjectExtensions
    {
        public static UInt32 PartitionFromOffsetBottom(this TraceProject project, UInt32 offset)
        {
            return (offset - (offset % project.PartitionSize)) / project.PartitionSize;
        }

        public static UInt32 PartitionFromOffsetTop(this TraceProject project, UInt32 offset)
        {
            return (offset + (offset % project.PartitionSize)) / project.PartitionSize;
        }
    }
}
