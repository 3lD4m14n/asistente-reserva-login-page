import axios from "axios";

export default async function airtableAuth() {
  const body = new URLSearchParams();
  const airtableAuthorizationData = await axios
    .get("/api/airtable/authorize")
    .then((res) => res.data);
  body.append("code", airtableAuthorizationData.code);
  body.append("client_id", process.env.AIRTABLE_CLIENT_ID as string);
  body.append("redirect_uri", process.env.AIRTABLE_REDIRECT_URI as string);
  body.append("grant_type", "authorization_code");
  body.append("code_verifier", airtableAuthorizationData.code_verifier);

  const airtableResponse = await axios.post(
    "https://airtable.com/oauth2/v1/token",
    body,
    {
      params: {
        Authorization: `Basic ${process.env.NEXT_PUBLIC_AIRTABLE_CLIENT_ID}:${process.env.NEXT_PUBLIC_AIRTABLE_CLIENT_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (airtableResponse.status !== 200) {
    return new Response("Error", { status: 500 });
  }

  return airtableResponse.data;
}
