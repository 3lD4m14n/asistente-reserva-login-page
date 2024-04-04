"use client";
import { airtableOauthClient } from "@/helpers/airtableAuthClient";
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
  const getTokens = async () => {
    await airtableOauthClient.receiveCode();
    const tokens = await airtableOauthClient.getTokens();
    console.log(tokens);
    //redirect("/");
  };
  useEffect(() => {
    getTokens();
  }, [searchParams]);

  return <>
    <h1>Enviando credenciales</h1>
  </>;
}
