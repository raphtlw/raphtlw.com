import { list } from "@vercel/blob";
import { VideoHTMLAttributes } from "react";

export type HostedVideoPlayerProps = VideoHTMLAttributes<HTMLVideoElement> & {
  fileName?: string;
};

export const HostedVideoPlayer = async ({
  fileName,
  ...props
}: HostedVideoPlayerProps) => {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  });
  const { url } = blobs[0];

  return (
    <video {...props}>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
