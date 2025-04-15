import { GraphQLClient } from "graphql-request";
import { config } from "../../shared/config";
import { getAccessToken } from "./getAccessToken";

if (!config.VYRO_GRAPHQL_API_ENDPOINT) {
  throw new Error(
    "VYRO_GRAPHQL_API_ENDPOINT is not set. Please set it in your environment variables or .env file or src/shared/config.ts"
  );
}

const endpoint = `${config.VYRO_GRAPHQL_API_ENDPOINT}/v1/graphql`;

export const graphqlClient = new GraphQLClient(endpoint, {
  requestMiddleware: async (request) => {
    const accessToken = await getAccessToken();

    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  },
});
