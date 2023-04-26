import { Metadata } from "next";
import { siteUrl, siteName, description } from "@/metadata";

export type PageInfo = {
  title: string;
  description: string;
  imageUrls: string[];
};

export const pageInfoBase: PageInfo = {
  title: siteName,
  description: description,
  imageUrls: [`${siteUrl}/icon.png`],
};

export const toMetadata = (m: PageInfo): Metadata => ({
  title: m.title,
  description: m.description,
  openGraph: {
    type: "article",
    title: m.title,
    description: m.description,
    images: m.imageUrls,
  },
  twitter: {
    card: "summary",
    title: m.title,
    description: m.description,
    images: m.imageUrls,
  },
  icons: {
    icon: { url: "/favicon.ico", type: "image/x-icon" },
  },
  viewport: "initial-scale=1, viewport-fit=cover",
});
