import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateState, generateCodeVerifier } from "@/helpers/generateRandomCode";
import { encodeToBase64UrlSha256 } from "@/helpers/codifyCodeChallenge";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = encodeToBase64UrlSha256(codeVerifier);
  
  const cookieStorage = cookies();
  cookieStorage.set("state", state, {httpOnly: true});
  cookieStorage.set("code_verifier", codeVerifier, {httpOnly: true});
  cookieStorage.set("tableName", "UsersServicioTable", {httpOnly: true});

  const url = new URL("https://airtable.com/oauth2/v1/authorize")
  url.searchParams.set("state", state);
  url.searchParams.set("client_id", process.env.AIRTABLE_CLIENT_ID as string);
  url.searchParams.set("redirect_uri", process.env.AIRTABLE_REDIRECT_URI as string);
  url.searchParams.set("scope", "data.records:read data.records:write schema.bases:read schema.bases:write");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(url);
}
