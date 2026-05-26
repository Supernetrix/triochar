/**
 * Static site configuration.
 *
 * Homepage content and contact details are intentionally code-managed
 * (not CMS-editable) to keep the CMS simple for a non-technical owner.
 */

export const siteConfig = {
  brandName: "Triochar",
  logoText: "Triochar",
  tagline: "Bankable and Trustworthy Carbon Credits",

  contactEmail: "partnerships@triochar.io",
  contactPhone: "Book a calendar call",
  contactPhoneHref: "https://triochar.io/meet-kubi",
  contactLocation: "Global carbon market",

  seoTitle: "Triochar | Bankable and Trustworthy Carbon Credits",
  seoDescription:
    "Triochar guides you to complete your journey from decarbonization thought to becoming net zero.",

  footerNote:
    "A lean and trustworthy partner for credible carbon credit discovery and corporate decarbonization.",
};

export type SiteConfig = typeof siteConfig;
