export function ensureEnv(key: string, errorMessage?: string): string {
  if (process.env[key] === undefined) {
    if (typeof window !== "undefined" && key.startsWith("NEXT_PUBLIC_")) {
      throw new Error(
        `Missing environment variable on client: ${key}${errorMessage ? `\n${errorMessage}` : ""}`,
      );
    } else {
      throw new Error(
        `Missing environment variable on server: ${key}${errorMessage ? `\n${errorMessage}` : ""}`,
      );
    }
  }

  return process.env[key];
}

export const isDev = process.env.npm_lifecycle_event === "dev";
