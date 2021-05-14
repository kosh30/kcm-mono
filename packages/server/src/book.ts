import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const dynamoDBClient = new DynamoDBClient({ region: "us-east-1" });

// eslint-disable-next-line import/prefer-default-export
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const getItemCommand = new GetItemCommand({
    Key: marshall({ PK: "BOOK" }),
    TableName: process.env.TABLE,
  });

  const { Item: book } = await dynamoDBClient.send(getItemCommand);

  if (!book) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Not Found",
        message: "Book not found",
        path: event.rawPath,
        status: "404",
        timestamp: Date.now().toString(),
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(book)),
  };
};
