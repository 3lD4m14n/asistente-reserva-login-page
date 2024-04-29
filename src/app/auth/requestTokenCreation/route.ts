import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import QueryString from "qs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cookiesStore = cookies();
  const data = {
    code: searchParams.get("code"),
    client_id: process.env.AIRTABLE_CLIENT_ID,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    grant_type: "authorization_code",
    code_verifier: cookiesStore.get("code_verifier")?.value,
  };
  const formattedData = QueryString.stringify(data);

  //TODO: Por fin funciono, solo falta guardarlo
  //nombre de la variable: access_token
  //nombre de la variable: refresh_token
  axios
    .post("https://airtable.com/oauth2/v1/token", formattedData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => response.data)
    .then(async (data) => {
      let row = await axios
        .post(
          `https://api.botpress.cloud/v1/tables/${cookiesStore.get("tableName")}/rows/find`,
          {
            filter: {
              PhoneID: 123,
            },
          },
        )
        .then((response) => response.data[0]);

      row.access_token = data.access_token;
      row.refresh_token = data.refresh_token;

      axios.put(
        `https://api.botpress.cloud/v1/tables/${cookiesStore.get("tableName")}/rows`,
        [row],
      );
    });

  //return NextResponse.redirect(process.env.VERCEL_URL as string);
  return new Response("OK", { status: 200 });
}
