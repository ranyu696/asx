import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import { Navbar } from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import Footer from "@/components/Footer";
import YandexMetrica from "@/components/YandexMetrica";
import {
  fetchWebsiteMetadata,
  fetchCategories,
  fetchWebsiteDetails,
} from "@/config/api";
import { WebsiteData } from "@/types";

import { Providers } from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  const data: WebsiteData = await fetchWebsiteMetadata();
  const seo = data.attributes.seo;

  const metaSocial =
    seo.metaSocial?.map((social) => ({
      socialNetwork: social.socialNetwork,
      title: social.title,
      description: social.description,
    })) || [];

  const metaRobots = seo.metaRobots
    ? [
        seo.metaRobots.index ? "index" : "noindex",
        seo.metaRobots.follow ? "follow" : "nofollow",
        seo.metaRobots.nocache ? "noarchive" : "",
      ]
        .filter(Boolean)
        .join(", ")
    : "index, follow";

  return {
    title: {
      template: seo.templateTitle,
      default: seo.metaTitle || "默认标题",
    },
    description: seo.metaDescription || "默认描述",
    metadataBase: new URL(`${seo.canonicalURL}`),
    robots: metaRobots,
    keywords: seo.keywords || "默认关键词",
    openGraph: {
      type: "website",
      url: seo.canonicalURL,
      title: seo.metaTitle || "默认标题",
      description: seo.metaDescription || "默认描述",
    },
    twitter:
      metaSocial.length > 0
        ? {
            card: "summary_large_image",
            site: "@nextjs",
            creator: "@nextjs",
            title: metaSocial[0].title,
            description: metaSocial[0].description,
          }
        : undefined,
    alternates: {
      canonical: seo.canonicalURL,
    },
    generator: seo.BasicFields?.generator || "",
    applicationName: seo.BasicFields?.applicationName || "",
    referrer: seo.BasicFields?.referrer,
    authors:
      seo.BasicFields?.authors
        ?.split(",")
        .map((author: string) => ({ name: author.trim() })) || [],
    creator: seo.BasicFields?.creator || "",
    publisher: seo.BasicFields?.publisher || "",
    formatDetection: {
      email: seo.formatDetection?.email || false,
      address: seo.formatDetection?.address || false,
      telephone: seo.formatDetection?.telephone || false,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, websiteDetails] = await Promise.all([
    fetchCategories(),
    fetchWebsiteDetails(),
  ]);

  const {
    googleAnalyticsId,
    PPURL,
    MetrikaID,
    email,
    links,
  } = websiteDetails.attributes;

  return (
    <html suppressHydrationWarning lang="zh-CN">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <YandexMetrica tagID={MetrikaID}>
          <GoogleAnalytics gaId={googleAnalyticsId} />
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar categories={categories} />
              <div className="bg-indigo-600 px-4 py-3 text-white">
                <p className="text-center text-sm font-medium">
                  永久域名：{PPURL}
                </p>
              </div>
              <main className="container mx-auto max-w-7xl pt-16 px-3 flex-grow">
                {children}
              </main>
              <Footer email={email} links={links.data} />
            </div>
          </Providers>
          <Script
          src="/script.js"
          strategy="lazyOnload"
        />
        </YandexMetrica>
      </body>
    </html>
  );
}
