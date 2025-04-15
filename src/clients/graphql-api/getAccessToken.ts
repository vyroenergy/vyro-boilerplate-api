import axios from "axios";
import { config } from "../../shared/config";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.request({
      method: "POST",
      url: `${config.VYRO_AUTHENTICATION_API_ENDPOINT}/api-client/authenticate`,
      data: {
        client_id: config.VYRO_CLIENT_ID,
        client_secret: config.VYRO_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const accessToken = response.data.access_token;

    tokenExpiry = now + 1000 * 60 * 55; // 55 minutes (token lifetime is 60 minutes)
    cachedToken = accessToken;

    return accessToken;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw new Error("Unable to authenticate with Vyro API");
  }
}
