import * as sst from "@serverless-stack/resources";

import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as s3 from "@aws-cdk/aws-s3";

import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers";

export default class Stack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create the Dynamodb Table
    const table = new sst.Table(this, "Table", {
      fields: {
        PK: sst.TableFieldType.STRING,
        GSI1PK: sst.TableFieldType.STRING,
        GSI2PK: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "PK" },
      secondaryIndexes: {
        GSI1: { partitionKey: "GSI1PK" },
        GSI2: { partitionKey: "GSI2PK" },
      },
    });

    // Create the Books Bucket
    const bucket = new sst.Bucket(this, "Books", {
      s3Bucket: {
        cors: [
          {
            maxAge: 3000,
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            allowedMethods: [s3.HttpMethods.PUT],
          },
        ],
      },
    });

    const parseFunction = new sst.Function(this, "ParseFunction", {
      handler: "src/parse.handler",
      timeout: 900,
      environment: {
        BOOKS: bucket.s3Bucket.bucketName,
        TABLE: table.dynamodbTable.tableName,
      },
    });

    // Add parse as handler for object created notification
    bucket.addNotification(this, {
      function: parseFunction,
      notificationProps: {
        events: [s3.EventType.OBJECT_CREATED],
        filters: [{ suffix: ".csv" }],
      },
    });

    // Add parse as handler for object created notification
    bucket.addNotification(this, {
      function: parseFunction,
      notificationProps: {
        events: [s3.EventType.OBJECT_CREATED],
        filters: [{ suffix: ".CSV" }],
      },
    });

    // Give the notification functions permissions to access the bucket and table
    bucket.attachPermissions([bucket, table]);

    // Create the User Pool
    const userPool = new cognito.UserPool(this, "UserPool", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      signInAliases: {
        username: true,
        email: true,
      },
      standardAttributes: {
        familyName: {
          mutable: true,
          required: true,
        },
        givenName: {
          mutable: true,
          required: true,
        },
        nickname: {
          mutable: true,
          required: false,
        },
      },
    });

    // Create the User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      generateSecret: false,
    });

    // Create the Identitiy Pool
    new cognito.CfnIdentityPool(this, "IdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      cors: true,
      defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
      defaultAuthorizer: new HttpUserPoolAuthorizer({
        userPool,
        userPoolClient,
      }),
      defaultFunctionProps: {
        environment: {
          BOOKS: bucket.s3Bucket.bucketName,
          TABLE: table.dynamodbTable.tableName,
        },
      },
      routes: {
        "GET /presigned": "src/presigned.handler",
      },
    });

    api.attachPermissions([bucket, table]);

    // Show API endpoint in output
    this.addOutputs({
      ApiEndpoint: api.url,
      UserPoolId: userPool.userPoolId,
      UserPoolClientId: userPoolClient.userPoolClientId,
    });
  }
}
