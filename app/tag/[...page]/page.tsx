import { Suspense } from "react";
import Script from "next/script";
import { Metadata } from "next";

import { title, subtitle } from "@/components/primitives";
import VideoGrid from "@/components/VideoGrid";
import PaginationComponent from "@/components/Pagination";
import { generateJsonLd } from "@/config/utils";
import { fetchTagData, fetchWebsiteData, fetchVideos } from "@/config/api";

export async function generateMetadata({
  params,
}: {
  params: { page: string[] };
}): Promise<Metadata> {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;
  const tag = await fetchTagData(slug);
  const websiteData = await fetchWebsiteData();

  const pageTitle = `${tag.attributes.name} 在线观看 - 第${pageNumber}页`;
  const pageDescription = `探索 ${tag.attributes.name} 标签下的精彩视频，第${pageNumber}页`;
  const pageUrl = `${websiteData.attributes.seo.canonicalURL}/tag/${encodeURIComponent(slug)}/${pageNumber}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: websiteData.attributes.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: { page: string[] };
}) {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20;

  const tag = await fetchTagData(slug);
  const websiteData = await fetchWebsiteData();
  const { videos, totalPages } = await fetchVideos(
    "tag",
    tag.id,
    pageNumber,
    pageSize,
  );

  const {
    imageURL: websiteImageURL,
    seo,
    name: websiteName,
  } = websiteData.attributes;

  const jsonLd = generateJsonLd({
    type: "CollectionPage",
    name: `${tag.attributes.name} 在线观看 - 第${pageNumber}页`,
    description: `探索 ${tag.attributes.name} 标签下的精彩视频，第${pageNumber}页`,
    url: `${seo.canonicalURL}/tag/${encodeURIComponent(slug)}/${pageNumber}`,
    websiteName,
    websiteUrl: seo.canonicalURL,
    itemCount: videos.length,
    items: videos,
    aboutName: tag.attributes.name,
    aboutType: "Thing",
  });

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="ld+json"
        type="application/ld+json"
      />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{tag.attributes.name} 在线观看</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            探索 {tag.attributes.name} 标签下的精彩视频
          </h2>
        </div>

        <Suspense fallback={<div>Loading videos...</div>}>
          <VideoGrid videos={videos} websiteImageURL={websiteImageURL} />
        </Suspense>

        <div className="mt-8">
          <PaginationComponent
            basePath="/tag"
            pageNumber={pageNumber}
            slug={slug}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
}
