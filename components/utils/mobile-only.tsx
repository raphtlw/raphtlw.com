import { headers } from "next/headers";
import { PropsWithChildren } from "react";
import { UAParser } from "ua-parser-js";

export const MobileOnly = async ({ children }: PropsWithChildren) => {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") || "";
  const ua = UAParser(userAgent);
  const isMobile = ua.device.type === "mobile";

  return isMobile ? children : <></>;
};
