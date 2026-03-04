import { cdnLink } from "@/lib/cdn";
import { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  return cdnLink(src);
}
