"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

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
      const tokens = await axios.get("/auth/requestTokenCreation", {
        params: searchParams,
      });
      console.log(tokens);
      //redirect("/");
    };
    getTokens();
  }, [searchParams]);

  return (
    <>
      <h1>Enviando credenciales</h1>
    </>
  );
}
