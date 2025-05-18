import { getAuthToken } from "./zohoAuth";

const { ZOHO_ORG_ID, ZOHO_DOMAIN } = process.env;

export const getOrganizationDetails = async (accessToken?: string) => {
  try {
    const token = accessToken || (await getAuthToken());

    const url = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1/organizations/${ZOHO_ORG_ID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await res.json();
    if (res.status !== 200) {
      console.error("Error fetching organization details:", data);
      throw new Error("Failed to fetch organization details");
    }

    if (data.organization) return data.organization;

    throw new Error("No organization details found in response");
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};
