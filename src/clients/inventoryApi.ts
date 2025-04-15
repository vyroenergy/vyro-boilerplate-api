import { createClient } from "@vyro-x/inventory-api-client";
import { config } from "../shared/config";

export const inventoryApi = createClient({
  endpoint: config.VYRO_INVENTORY_API_ENDPOINT,
  clientId: config.VYRO_CLIENT_ID,
  clientSecret: config.VYRO_CLIENT_SECRET,
});
