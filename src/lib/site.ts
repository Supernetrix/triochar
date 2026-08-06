/**
 * Static site configuration.
 *
 * Homepage content and contact details are intentionally code-managed
 * (not CMS-editable) to keep the CMS simple for a non-technical owner.
 */

export const siteConfig = {
  siteUrl: "https://climate-assets.com",
  siteDomain: "climate-assets.com",
  brandName: "Climate Assets",
  logoText: "Climate Assets",
  tagline: "Bankable and Trustworthy Carbon Credits",

  contactEmail: "Partnerships@climate-assets.com",
  contactPhone: "Book a calendar call",
  contactPhoneHref:
    "https://bookings.cloud.microsoft/bookwithme/user/d714a9d88abf48afa17ef862edec79f6%40triochar.io/meetingtype/H-w8DlZKnUucU5hwTMYCGw2?anonymous&ismsaljsauthenabled",
  contactLocation: "Andrea Souroukli 9, 6021 Larnaca, Cyprus",
  contactLocationHref:
    "https://www.google.com/maps/search/?api=1&query=Andrea+Souroukli+9%2C+6021+Larnaca%2C+Cyprus",

  seoTitle: "Climate Assets | Bankable and Trustworthy Carbon Credits",
  seoDescription:
    "Climate Assets helps buyers, suppliers, and partners discover trustworthy carbon credit projects and move from climate intent to procurement confidence.",
  seoImage: "/images/hero-carbon-platform.png",
  seoKeywords: [
    "Climate Assets",
    "climate-assets.com",
    "carbon credits",
    "carbon credit projects",
    "carbon credit brokerage",
    "verified carbon credits",
    "carbon markets",
    "net zero",
    "decarbonization",
    "climate assets",
  ],

  footerNote:
    "A lean and trustworthy partner for credible carbon credit discovery and corporate decarbonization.",
};

export type SiteConfig = typeof siteConfig;
