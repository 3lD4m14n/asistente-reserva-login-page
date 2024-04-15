import { OAuth2AuthCodePkceClient, Storage } from "oauth2-pkce";

class StorageInBotpress implements Storage {
  saveState(serializedState: string) {
    window.localStorage.setItem("botpress", serializedState);
  }
  loadState() {
    return window.localStorage.getItem("botpress");
  }
}

const storageInBotpress = new StorageInBotpress();

//airtable auth client
export const createAirtableOauthClient = () => {
  return new OAuth2AuthCodePkceClient({
    clientId: process.env.NEXT_PUBLIC_AIRTABLE_CLIENT_ID as string,
    authorizationUrl: "https://airtable.com/oauth2/v1/authorize",
    tokenUrl: "https://airtable.com/oauth2/v1/token",
    redirectUrl: process.env.NEXT_PUBLIC_AIRTABLE_REDIRECT_URI as string,
    scopes: [
      "data.records:read",
      "data.records:write",
      "schema.bases:read",
      "schema.bases:write",
    ],
  });
};
