import config from "./src/aws-exports.js";

// import CdkBackendStack from "../src/cdk-exports.json";

// const CDKConfig = {
//   aws_appsync_region: CdkBackendStack.BackendStack.graphqlendpointiamregion,
//   aws_appsync_graphqlEndpoint:
//     CdkBackendStack.BackendStack.awsappsyncgraphqlEndpoint,
//   aws_appsync_authenticationType:
//     CdkBackendStack.BackendStack.awsappsyncauthenticationType,
//   aws_appsync_apiKey: CdkBackendStack.BackendStack.awsappsyncapiKey,
// };

const combinedConfig = {
  ...config,
  // ...CDKConfig,
};

export default combinedConfig;
