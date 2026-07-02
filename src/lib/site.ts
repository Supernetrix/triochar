/**
 * Static site configuration.
 *
 * Homepage content and contact details are intentionally code-managed
 * (not CMS-editable) to keep the CMS simple for a non-technical owner.
 */

export const siteConfig = {
  brandName: "Climate Assets Exchange",
  logoText: "Climate Assets Exchange",
  tagline: "Bankable and Trustworthy Carbon Credits",

  contactEmail: "Partnerships@climate-assets.com",
  contactPhone: "Book a calendar call",
  contactPhoneHref:
    "https://bookings.cloud.microsoft/bookwithme/user/d714a9d88abf48afa17ef862edec79f6%40triochar.io/meetingtype/H-w8DlZKnUucU5hwTMYCGw2?anonymous&ismsaljsauthenabled",
  contactLocation: "Andrea Souroukli 9, 6021 Larnaca, Cyprus",
  contactLocationHref:
    "https://www.google.com/maps/search/?api=1&query=Andrea+Souroukli+9%2C+6021+Larnaca%2C+Cyprus",

  seoTitle: "Climate Assets Exchange | Bankable and Trustworthy Carbon Credits",
  seoDescription:
    "Climate Assets Exchange guides you to complete your journey from decarbonization thought to becoming net zero.",

  footerNote:
    "A lean and trustworthy partner for credible carbon credit discovery and corporate decarbonization.",
};

export type SiteConfig = typeof siteConfig;
