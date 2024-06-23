import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import React from "react";
import Metrika from "next-metrika";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

import { Navbar } from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import Footer from "@/components/Footer";

import { Providers } from "./providers";

export async function generateMetadata(): Promise<Metadata> {
  // 从 API 获取数据
  const response = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields[0]=name&populate[seo][populate][0]=metaSocial&populate[seo][populate][1]=BasicFields&populate[seo][populate][2]=formatDetection&populate[seo][populate][3]=metaRobots",
  );
  const data = await response.json();
  const seo = data?.data?.attributes?.seo || {};

  // 构建 metaSocial 数据
  const metaSocial =
    seo.metaSocial?.map((social: any) => ({
      socialNetwork: social.socialNetwork,
      title: social.title,
      description: social.description,
    })) || [];

  // 构建 metaRobots 数据
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
    twitter: metaSocial.map((social: any) => ({
      handle: "@nextjs",
      site: "@nextjs",
      cardType: "summary_large_image",
      title: social.title,
      description: social.description,
    })),
    alternates: {
      canonical: seo.canonicalURL,
    },
    generator: seo.BasicFields?.generator || "",
    applicationName: seo.BasicFields?.applicationName || "",
    referrer: seo.BasicFields?.referrer || "",
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
  const resCategory = await fetch(
    "https://strapi.xiaoxinlook.cc/api/categories?website=1&populate=subcategories.*&filters[isCategory][$eq]=true",
    { cache: "no-store" },
  );
  const dataCategory = await resCategory.json();
  const categories = dataCategory.data;

  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields[]=googleAnalyticsId&fields[]=email&fields[]=PPURL&fields[]=MetrikaID&fields[]=advertisementCode&fields[]=announcement&populate=links",
  );
  const dataWebsite = await resWebsite.json();
  const googleAnalyticsId = dataWebsite.data.attributes.googleAnalyticsId;
  const email = dataWebsite.data.attributes.email;
  const PPURL = dataWebsite.data.attributes.PPURL;
  const MetrikaID = dataWebsite.data.attributes.MetrikaID;
  const advertisementCode =
    dataWebsite.data.attributes.advertisementCode[0].children[0].text;
  const links = dataWebsite.data.attributes.links;

  return (
    <html suppressHydrationWarning lang="zh-CN">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Metrika id={MetrikaID} />
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
            <Footer email={email} links={links} /> {/* 使用 Footer 组件 */}
          </div>
        </Providers>
        {advertisementCode && (
          <Script id="advertisementCode" strategy="lazyOnload">
            {`${advertisementCode}`}
          </Script>
        )}
      </body>
    </html>
  );
}
