import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { headersForBotpress } from "@/helpers/headersForBotpress";
import type { AuthOptions } from "next-auth";

export const options: AuthOptions = {
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      console.log("obteniendo informacion del usuario: ", session.user.email);
      let clientRow = await axios
        .post(
          "https://api.botpress.cloud/v1/tables/UsersConsumoTable/rows/find",
          {
            filter: {
              Email: session.user.email,
            },
          },
          { headers: headersForBotpress },
        )
        .then((res) => res.data.rows[0]);

      let assistantType = "Consumo";
      if (!clientRow) {
        clientRow = await axios
          .post(
            "https://api.botpress.cloud/v1/tables/UsersServicioTable/rows/find",
            {
              filter: {
                Email: session.user?.email,
              },
            },
            { headers: headersForBotpress },
          )
          .then((res) => res.data.rows[0]);

        assistantType = "Servicio";
      }
      console.log("obtenida informacion del usuario: ", clientRow);

      if (assistantType === "Consumo") {
        clientRow.RefreshToken = token.refreshToken;
        clientRow["Personal Access Token"] = token.accessToken;
      }

      session.userInfo = clientRow;
      session.assistantType = Object.keys(assistantType)
        ? assistantType
        : "No Registrado";

      console.log("actualizando del usuario: ", session.user?.email);
      await axios.put(
        `https://api.botpress.cloud/v1/tables/${session.assistantType == "Consumo" ? "UsersConsumoTable" : "UsersServicioTable"}/rows`,
        { rows: [clientRow] },
        { headers: headersForBotpress },
      );
      console.log("actualizado el usuario: ", session.user?.email);

      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "https://www.googleapis.com/auth/spreadsheets openid profile email",
        },
      },
    }),
    {
      id: "airtable",
      name: "Airtable",
      type: "oauth",
      authorization: {
        url: "https://airtable.com/oauth2/v1/authorize",
        params: {
          client_id: process.env.NEXT_PUBLIC_AIRTABLE_CLIENT_ID,
          response_type: "code",
          redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
          scope:
            "data.records:read data.records:write schema.bases:read schema.bases:write",
          code_challenge_method: "S256",
        },
      },
      token: "https://api.airtable.com/oauth2/v1/token",
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
