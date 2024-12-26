"use client";

/**
 * Hack to work around next.js hydration
 * @see https://github.com/uidotdev/usehooks/issues/218
 */

import { useIsClient } from "@uidotdev/usehooks";
import { PropsWithChildren } from "react";

export type ClientOnlyProps = PropsWithChildren;

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const isClient = useIsClient();

  // Render children if on client side, otherwise return null
  return isClient ? <>{children}</> : null;
};
