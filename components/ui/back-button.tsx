"use client";

import { cn } from "@/lib/utils";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { SpatialMaterial, SpatialMaterialProps } from "../spatial/material";

export type BackButtonProps = SpatialMaterialProps;

export const BackButton = ({ className, ...props }: BackButtonProps) => {
  const router = useRouter();

  return (
    <SpatialMaterial
      className={cn(
        "flex flex-none gap-4 items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-200",
        className,
      )}
      enableTap
      onClick={() => router.back()}
      {...props}
    >
      <CaretLeftIcon />
      <span>Go back</span>
    </SpatialMaterial>
  );
};
