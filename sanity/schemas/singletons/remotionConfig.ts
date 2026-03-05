import { defineField, defineType } from "sanity";

export default defineType({
  name: "remotionConfig",
  title: "Remotion Config",
  type: "document",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "awsRegion",
      title: "AWS Region",
      type: "string",
      description: "AWS region where Remotion Lambda is deployed (must match your Lambda function region)",
      initialValue: "us-east-1",
    }),
    defineField({
      name: "functionName",
      title: "Function Name",
      type: "string",
      description: "Name of the deployed Remotion Lambda function (created by deployFunction())",
      initialValue: "",
    }),
    defineField({
      name: "serveUrl",
      title: "Serve URL",
      type: "string",
      description: "S3 URL of the deployed Remotion bundle (created by deploySite()). Required for rendering",
      initialValue: "",
    }),
    defineField({
      name: "maxRenderTimeoutSec",
      title: "Max Render Timeout (sec)",
      type: "number",
      description: "Maximum seconds to wait for a Lambda render before timing out",
      initialValue: 240,
    }),
    defineField({
      name: "memoryMb",
      title: "Memory (MB)",
      type: "number",
      description: "Memory allocated to the Remotion Lambda function in MB",
      initialValue: 2048,
    }),
    defineField({
      name: "diskMb",
      title: "Disk (MB)",
      type: "number",
      description: "Ephemeral disk space for the Lambda function in MB",
      initialValue: 2048,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Remotion Config" };
    },
  },
});
