import { Buffer } from "buffer";
import crypto from "crypto";

//return a base64 url encode of the sha256 of the codeVerifier
export function encodeToBase64UrlSha256(input: string): string {
    // Calcula el hash SHA-256 del string de entrada
    const sha256Hash = crypto.createHash("sha256").update(input, "utf8").digest("base64");

    // Codifica el hash SHA-256 en base64 URL
    const base64Url = Buffer.from(sha256Hash, "base64").toString("base64url");

    return base64Url;
}
