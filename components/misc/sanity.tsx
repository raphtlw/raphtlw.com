"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useDraftModeEnvironment } from "next-sanity/hooks";
import { useRouter } from "next/navigation";
import { SpatialMaterial, SpatialMaterialProps } from "../spatial/material";
import { ClientOnly } from "../utils/client-only";

export type LaunchAdminButtonProps = SpatialMaterialProps;

export const LaunchAdminButton = (props: SpatialMaterialProps) => {
  return (
    <ClientOnly>
      <Inner {...props} />
    </ClientOnly>
  );
};

export const Inner = ({ className, ...props }: SpatialMaterialProps) => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <SpatialMaterial
        className={cn("rounded-l-full px-4 py-2 -mr-1", className)}
        onClick={() => router.push("/studio")}
        reactToMouse
        enableTap
        {...props}
      >
        Open Sanity
      </SpatialMaterial>
    );
  }
};

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
