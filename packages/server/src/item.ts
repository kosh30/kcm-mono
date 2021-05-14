import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { Item } from "@kcm/shared/src/types";

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });

// eslint-disable-next-line import/prefer-default-export
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { classDesc, itemCode, upc } = event.queryStringParameters ?? {};

  if (!classDesc && !itemCode && !upc) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Bad Request",
        message: "One of classDesc, itemCode, or upc is required.",
        path: event.rawPath,
        status: "400",
        timestamp: Date.now().toString(),
      }),
    };
  }

  let item: Item | undefined;

  if (itemCode) {
    const getItemCommand = new GetItemCommand({
      Key: marshall({ PK: `ITEM#${itemCode}` }),
      TableName: process.env.TABLE,
    });

    const response = await dynamoDBClient.send(getItemCommand);

    item = response.Item ? (unmarshall(response.Item) as Item) : undefined;
  } else if (upc) {
    const queryCommand = new QueryCommand({
      ExpressionAttributeNames: { "#GSI1PK": "GSI1PK" },
      ExpressionAttributeValues: marshall({ ":GSI1PK": `ITEM#${upc}` }),
      KeyConditionExpression: "#GSI1PK = :GSI1PK",
      IndexName: "GSI1",
      TableName: process.env.TABLE,
    });

    const response = await dynamoDBClient.send(queryCommand);
    const items = (response.Items ?? []).map((i) => unmarshall(i));

    item = items.length > 0 ? (items[0] as Item) : undefined;
  }

  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Not Found",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        message: `Item with identifier ${itemCode || upc} not found`,
        path: event.rawPath,
        status: "404",
        timestamp: Date.now().toString(),
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};
