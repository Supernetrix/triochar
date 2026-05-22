import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SiteChrome } from "@/components/site-chrome";
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
  metadataBase: new URL("https://triochar.vercel.app"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <SiteChrome
          header={<Header brandName={siteConfig.brandName} logoText={siteConfig.logoText} />}
          footer={
            <Footer
              brandName={siteConfig.brandName}
              footerNote={siteConfig.footerNote}
              contactEmail={siteConfig.contactEmail}
            />
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
