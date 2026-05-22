/**
 * Static site configuration.
 *
 * Homepage content and contact details are intentionally code-managed
 * (not CMS-editable) to keep the CMS simple for a non-technical owner.
 */

export const siteConfig = {
  brandName: "Triochar",
  logoText: "Triochar",
  tagline: "Bankable & Trustworthy Carbon Credits",

  contactEmail: "partnerships@triochar.com",
  contactPhone: "Phone available on request",
  contactLocation: "India & global carbon markets",

  seoTitle: "Triochar | Bankable & Trustworthy Carbon Credits",
  seoDescription:
    "Triochar serves your need for bankable and trustworthy carbon credits — guiding companies from first thought to net zero.",

  footerNote:
    "A lean, trustworthy partner for credible carbon credit discovery and corporate decarbonisation.",
};

export type SiteConfig = typeof siteConfig;
