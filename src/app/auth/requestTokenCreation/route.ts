import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { headersForBotpress } from "@/helpers/headersForBotpress";
import { authOptions } from "@/app/api/auth/authOptions";
import { getServerSession } from "next-auth/next";
import QueryString from "qs";

export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;
  const cookiesStore = cookies();
  const data = {
    code: searchParams.get("code"),
    client_id: process.env.AIRTABLE_CLIENT_ID,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    grant_type: "authorization_code",
    code_verifier: cookiesStore.get("code_verifier")?.value,
  };
  const session = await getServerSession(authOptions);
  const formattedData = QueryString.stringify(data);

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
          `https://api.botpress.cloud/v1/tables/${cookiesStore.get("tableName")?.value}/rows/find`,
          {
            filter: {
              Email: session?.user?.email,
            },
          },
          {
            headers: headersForBotpress,
          },
        )
        .then((response) => response.data.rows[0]);

      console.log("data Tokens:\n", data, "row:\n", row);
      console.log(cookiesStore.get("tableName")?.value);

      row["Personal Access Token"] = data.access_token;
      row["RefreshToken"] = data.refresh_token;

      console.log("row:\n", row);

      axios.put(
        `https://api.botpress.cloud/v1/tables/${cookiesStore.get("tableName")?.value}/rows`,
        { rows: [row] },
        {
          headers: headersForBotpress,
        },
      );
    });

  return NextResponse.redirect(new URL("/", req.url));
}
