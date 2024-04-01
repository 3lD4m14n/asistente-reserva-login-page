import axios from "axios";
import {
  generateCodeVerifier,
  generateState,
} from "@/helpers/generateRandomCode";
import { encodeToBase64UrlSha256 } from "@/helpers/codifyCodeChallenge";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = encodeToBase64UrlSha256(codeVerifier);

  //imprimir por consola el client_id de airtable y el redirect_uri
  console.log("client_id de airtable: ");
  console.log(process.env.AIRTABLE_CLIENT_ID);
  console.log(process.env.AIRTABLE_REDIRECT_URI);

  const airtableResponse = await axios.get(
    "https://airtable.com/oauth2/v1/authorize",
    {
      params: {
        client_id: process.env.AIRTABLE_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        scope:
          "data.records:read data.records:write schema.bases:read schema.bases:write",
      },
    },
  );

  if (
    airtableResponse.data.state !== state ||
    airtableResponse.data.code_challenge !== codeChallenge
  ) {
    return new Response("Error", { status: 500 });
  }

  return new Response(
    JSON.stringify({
      code: airtableResponse.data.code,
      code_verifier: codeVerifier,
    }),
    { status: 200 },
  );
}
