import convict from "convict";
import { configDotenv } from "dotenv";
import path from "path";

configDotenv({
  path: path.resolve(__dirname, "../../.env"),
});

const schema = convict({
  VYRO_AUTHENTICATION_API_ENDPOINT: {
    type: String,
    default: "https://authentication-api.vyrolabs-staging.net",
    env: "VYRO_AUTHENTICATION_API_ENDPOINT",
  },
  VYRO_GRAPHQL_API_ENDPOINT: {
    type: String,
    default: "https://graphql.vyrolabs-staging.net",
    env: "VYRO_GRAPHQL_API_ENDPOINT",
  },
  VYRO_INVENTORY_API_ENDPOINT: {
    type: String,
    default: "https://inventory-api.vyrolabs-staging.net",
    env: "VYRO_INVENTORY_API_ENDPOINT",
  },
  VYRO_CLIENT_ID: {
    type: String,
    default: "",
    env: "VYRO_CLIENT_ID",
  },
  VYRO_CLIENT_SECRET: {
    type: String,
    default: "",
    env: "VYRO_CLIENT_SECRET",
  },
});

// Validate the loaded config matches the schema
schema.validate({ allowed: "strict" });

export const config = schema.getProperties();
