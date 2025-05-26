import { inspect } from "util";

export function ensureEnv(key: string, errorMessage?: string): string {
  if (process.env[key] === undefined) {
    if (typeof window !== "undefined" && key.startsWith("NEXT_PUBLIC_")) {
      throw new Error(
        `Missing environment variable on client: ${key}${errorMessage ? `\n${errorMessage}` : ""}\n${inspect(process.env)}`,
      );
    } else {
      throw new Error(
        `Missing environment variable on server: ${key}${errorMessage ? `\n${errorMessage}` : ""}\n${inspect(process.env)}`,
      );
    }
  }

  return process.env[key];
}

export const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";
