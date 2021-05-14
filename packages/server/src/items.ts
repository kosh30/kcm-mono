import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { Item } from "@kcm/shared/src/types";

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });

// eslint-disable-next-line import/prefer-default-export
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { classDesc } = event.queryStringParameters ?? {};

  if (!classDesc) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Bad Request",
        message: "ClassDesc is required.",
        path: event.rawPath,
        status: "400",
        timestamp: Date.now().toString(),
      }),
    };
  }

  let queryCommand = new QueryCommand({
    ExpressionAttributeNames: { "#GSI2PK": "GSI2PK" },
    ExpressionAttributeValues: marshall({ ":GSI2PK": `ITEM#${classDesc}` }),
    KeyConditionExpression: "#GSI2PK = :GSI2PK",
    IndexName: "GSI2",
    TableName: process.env.TABLE,
  });

  let response = await dynamoDBClient.send(queryCommand);
  const items = (response.Items ?? []).map((i) => unmarshall(i)) as Item[];

  while (response.LastEvaluatedKey) {
    queryCommand = new QueryCommand({
      ExclusiveStartKey: response.LastEvaluatedKey,
      ExpressionAttributeNames: { "#GSI2PK": "GSI2PK" },
      ExpressionAttributeValues: marshall({ ":GSI2PK": `ITEM#${classDesc}` }),
      KeyConditionExpression: "#GSI2PK = :GSI2PK",
      IndexName: "GSI2",

      TableName: process.env.TABLE,
    });

    // eslint-disable-next-line no-await-in-loop
    response = await dynamoDBClient.send(queryCommand);
    items.push(...((response.Items ?? []).map((i) => unmarshall(i)) as Item[]));
  }

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
};
