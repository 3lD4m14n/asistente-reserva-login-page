"use client";
import { createAirtableOauthClient } from "@/helpers/airtableAuthClient";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AirtableAuth({
  searchParams,
}: {
  searchParams:
    | {
        code: string;
        state: string;
        code_challenge: string;
        code_challenge_method: string;
      }
    | undefined;
}) {
  if (!searchParams) {
    redirect("/");
  }

  useEffect(() => {
    const getTokens = async () => {
      const airtableOauthClient = createAirtableOauthClient();
      await airtableOauthClient.receiveCode();
      const tokens = await airtableOauthClient.getTokens();
      console.log(tokens);
      //redirect("/");
    };
    getTokens();
  }, []);

  return (
    <>
      <h1>Enviando credenciales</h1>
    </>
  );
}
