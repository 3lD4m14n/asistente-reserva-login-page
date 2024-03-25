import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const headersForBotpress = {
  "Content-type": "application/json",
  "x-bot-id": process.env.BOTPRESS_BOT_ID,
  Authorization: `Bearer ${process.env.BOTPRESS_TOKEN}`,
};

const handler = NextAuth({
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      console.log("obteniendo informacion del usuario: ", session.user?.email);
      let clientRow = await axios
        .post(
          "https://api.botpress.cloud/v1/tables/UsersConsumoTable/rows/find",
          {
            filter: {
              Email: session.user?.email,
            },
          },
          { headers: headersForBotpress },
        )
        .then((res) => res.data.rows[0]);

      let assistantType = "consumo";
      if (!clientRow || !Object.keys(clientRow).length) {
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

        assistantType = "servicio";
      } 
      console.log("obtenida informacion del usuario: ", clientRow);

      clientRow.RefreshToken = token.refreshToken;
      clientRow["Personal Access Token"] = token.accessToken;

      session.userInfo = clientRow;
      session.assistantType = Object.keys( assistantType ) ? assistantType : "No Registrado";

      console.log("actualizando del usuario: ", session.user?.email);
      await axios.put(
        "https://api.botpress.cloud/v1/tables/UsersConsumoTable/rows",
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
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
