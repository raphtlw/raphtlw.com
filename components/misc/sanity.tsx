"use client";

import {
  SpatialMaterial,
  SpatialMaterialProps,
} from "@/components/spatial/material";
import { cn } from "@/lib/utils";
import { useDraftModeEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation";

export type DisableDraftModeProps = SpatialMaterialProps;

export const DisableDraftMode = ({
  className,
  ...props
}: DisableDraftModeProps) => {
  const router = useRouter();
  const environment = useDraftModeEnvironment();

  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  return (
    <SpatialMaterial
      className={cn("rounded-r-full px-4 py-2 -ml-1", className)}
      onClick={() => router.push("/api/draft-mode/disable")}
      reactToMouse
      enableTap
      {...props}
    >
      Disable Draft Mode
    </SpatialMaterial>
  );
};
