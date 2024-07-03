import { Suspense } from "react";
import Script from "next/script";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { title, subtitle } from "@/components/primitives";
import PaginationComponent from "@/components/Pagination";
import { generateJsonLd } from "@/config/utils";
import { fetchCategoryData, fetchWebsiteData, fetchVideos } from "@/config/api";
import VideoGrid from "@/components/VideoGrid";

export async function generateMetadata({
  params,
}: {
  params: { page: string[] };
}): Promise<Metadata> {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;
  const category = await fetchCategoryData(slug);
  const websiteData = await fetchWebsiteData();

  const pageTitle = `${category.attributes.name} 在线观看 - 第${pageNumber}页`;
  const pageDescription = `探索 ${category.attributes.name} 类别中的精彩视频，第${pageNumber}页`;
  const pageUrl = `${websiteData.attributes.seo.canonicalURL}/category/${slug}/${pageNumber}`;

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

export default async function CategoryPage({
  params,
}: {
  params: { page: string[] };
}) {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20;

  const category = await fetchCategoryData(slug);

  if (!category) {
    notFound();
  }

  const websiteData = await fetchWebsiteData();
  const { videos, totalPages } = await fetchVideos(
    "category",
    category.id,
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
    name: `${category.attributes.name} 在线观看 - 第${pageNumber}页`,
    description: `探索 ${category.attributes.name} 类别中的精彩视频，第${pageNumber}页`,
    url: `${seo.canonicalURL}/category/${slug}/${pageNumber}`,
    websiteName,
    websiteUrl: seo.canonicalURL,
    itemCount: videos.length,
    items: videos,
    aboutName: category.attributes.name,
    aboutType: "Thing",
  });

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="ld+json"
        type="application/ld+json"
      />
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>{category.attributes.name} 在线观看</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          探索 {category.attributes.name} 类别中的精彩视频
        </h2>
      </div>

      <div className="container mx-auto">
        <Suspense fallback={<div>Loading videos...</div>}>
          <VideoGrid videos={videos} websiteImageURL={websiteImageURL} />
        </Suspense>

        <div className="mt-8">
          <PaginationComponent
            basePath="/category"
            pageNumber={pageNumber}
            slug={slug}
            totalPages={totalPages}
          />
        </div>
      </div>
    </section>
  );
}
