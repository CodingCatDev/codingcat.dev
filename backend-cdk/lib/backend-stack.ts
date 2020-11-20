import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as rds from "@aws-cdk/aws-rds";
import * as appsync from "@aws-cdk/aws-appsync";
import * as cognito from "@aws-cdk/aws-cognito";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const userPool = cognito.UserPool.fromUserPoolId(
    //   this,
    //   "amplify-user-pool",
    //   "us-east-1_p0bw5lOuR"
    // );

    // // Create the AppSync API
    // const api = new appsync.GraphqlApi(this, "Api", {
    //   name: "ccd-api",
    //   schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
    //   authorizationConfig: {
    //     defaultAuthorization: {
    //       authorizationType: appsync.AuthorizationType.API_KEY,
    //       apiKeyConfig: {
    //         expires: cdk.Expiration.after(cdk.Duration.days(365)),
    //       },
    //     },
    //     additionalAuthorizationModes: [
    //       {
    //         authorizationType: appsync.AuthorizationType.USER_POOL,
    //         userPoolConfig: {
    //           userPool,
    //         },
    //       },
    //     ],
    //   },
    //   xrayEnabled: true,
    // });

    // // Create the VPC needed for the Aurora Serverless DB cluster
    // const vpc = new ec2.Vpc(this, "CcdVPC");
    // // Create the Serverless Aurora DB cluster; set the engine to Postgres
    // const cluster = new rds.ServerlessCluster(this, "AuroraBlogCluster", {
    //   engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
    //   parameterGroup: rds.ParameterGroup.fromParameterGroupName(
    //     this,
    //     "ParameterGroup",
    //     "default.aurora-postgresql10"
    //   ),
    //   defaultDatabaseName: "CcdDB",
    //   vpc,
    //   scaling: { autoPause: cdk.Duration.seconds(0) }, // Optional. If not set, then instance will pause after 5 minutes
    // });

    // // Create the Lambda function that will map GraphQL operations into Postgres
    // const postFn = new lambda.Function(this, "CcdAuroraHandler", {
    //   runtime: lambda.Runtime.NODEJS_10_X,
    //   code: new lambda.AssetCode("lambdas"),
    //   handler: "index.handler",
    //   memorySize: 1024,
    //   environment: {
    //     CLUSTER_ARN: cluster.clusterArn,
    //     SECRET_ARN: cluster.secret?.secretArn || "",
    //     DB_NAME: "CcdDB",
    //     AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    //   },
    // });
    // // Grant access to the cluster from the Lambda function
    // cluster.grantDataApiAccess(postFn);
    // // Set the new Lambda function as a data source for the AppSync API
    // const lambdaDatasource = api.addLambdaDataSource(
    //   "ccdAuroraDatasource",
    //   postFn
    // );

    // // Define resolvers to map GraphQL operations to the Lambda function
    // lambdaDatasource.createResolver({
    //   typeName: "Query",
    //   fieldName: "listPosts",
    // });
    // lambdaDatasource.createResolver({
    //   typeName: "Query",
    //   fieldName: "getPostById",
    // });
    // lambdaDatasource.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "createPost",
    // });
    // lambdaDatasource.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "updatePost",
    // });
    // lambdaDatasource.createResolver({
    //   typeName: "Mutation",
    //   fieldName: "deletePost",
    // });

    // // CFN Outputs
    // new cdk.CfnOutput(this, "aws_appsync_graphqlEndpoint", {
    //   value: api.graphqlUrl,
    // });
    // new cdk.CfnOutput(this, "aws_appsync_apiKey", {
    //   value: api.apiKey || "",
    // });
    // new cdk.CfnOutput(this, "aws_appsync_authenticationType", {
    //   value: "API_KEY",
    // });
    // new cdk.CfnOutput(this, "graphql_endpoint_iam_region", {
    //   value: this.region,
    // });
  }
}
