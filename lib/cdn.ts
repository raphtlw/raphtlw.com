export const cdnUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL!;

export const cdnLink = (slug: string) => {
  return new URL(`/${slug}`, cdnUrl).toString();
};
