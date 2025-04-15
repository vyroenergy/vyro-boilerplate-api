import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./graphql.schema.json",
  documents: ["./src/**/*.ts", "!./src/clients/**/*.ts"],
  overwrite: true,
  generates: {
    "./src/types/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        skipTypename: false,
        withHooks: false,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};
export default config;
