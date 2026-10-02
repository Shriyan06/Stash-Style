import brandImages from "@/data/brand-images.json";

export type BrandImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
  placeholder: boolean;
};

type Manifest = Record<string, BrandImage | null> & {
  logo: { src: string; srcOnDark?: string; width: number; height: number } | null;
};

const manifest = brandImages as unknown as Manifest;

export function brandImage(key: string | null | undefined): BrandImage | null {
  if (!key || key === "logo") return null;
  return (manifest[key] as BrandImage | undefined) ?? null;
}

export const brandLogo = manifest.logo;
