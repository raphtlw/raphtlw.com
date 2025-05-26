"use client";

/**
 * Hack to work around next.js hydration
 * TODO: remove in future
 */

import { PropsWithChildren, useEffect, useState } from "react";

export type ClientOnlyProps = PropsWithChildren;

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render children if on client side, otherwise return null
  return isClient ? <>{children}</> : null;
};
