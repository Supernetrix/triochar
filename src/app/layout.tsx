import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SiteChrome } from "@/components/site-chrome";
import { getHomeContent } from "@/lib/home-content";
import { siteConfig } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.seoTitle,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.seoDescription,
  metadataBase: new URL("https://climate-assets.com"),
  icons: {
    icon: "/brand/climate-assets-favicon.png",
    apple: "/brand/climate-assets-apple-touch-icon.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const homeContent = await getHomeContent();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <SiteChrome
          header={<Header brandName={siteConfig.brandName} logoText={siteConfig.logoText} navItems={homeContent.nav} />}
          footer={
            <Footer
              brandName={siteConfig.brandName}
              footerNote={siteConfig.footerNote}
              contactEmail={siteConfig.contactEmail}
              navItems={homeContent.nav}
            />
          }
        >
          {children}
        </SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
