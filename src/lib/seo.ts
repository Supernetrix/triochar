import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function createPageMetadata({
  title,
  description = siteConfig.seoDescription,
  path = "/",
  image = siteConfig.seoImage,
  noIndex = false,
}: PageMetadataInput = {}): Metadata {
  const pageUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const pageTitle = title ? `${title} | ${siteConfig.brandName}` : siteConfig.seoTitle;

  return {
    title,
    description,
    keywords: siteConfig.seoKeywords,
    alternates: {
      canonical: pageUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description,
      url: pageUrl,
      siteName: siteConfig.brandName,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1024,
          height: 1024,
          alt: siteConfig.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    alternateName: "Climate Assets",
    url: siteConfig.siteUrl,
    logo: absoluteUrl("/brand/climate-assets-padded-logo.png"),
    email: siteConfig.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Andrea Souroukli 9",
      postalCode: "6021",
      addressLocality: "Larnaca",
      addressCountry: "CY",
    },
    description: siteConfig.seoDescription,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    alternateName: "Climate Assets",
    url: siteConfig.siteUrl,
    description: siteConfig.seoDescription,
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
      url: siteConfig.siteUrl,
    },
  };
}
