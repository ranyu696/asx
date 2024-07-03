import Script from "next/script";
import { Metadata } from "next";

import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/components/VideoCard";
import PaginationComponent from "@/components/Pagination";
import { generateJsonLd } from "@/config/utils";
import { Video } from "@/types";
import { fetchWebsiteData, fetchVideos } from "@/config/api";

export async function generateMetadata({
  params,
}: {
  params: { page: string[] };
}): Promise<Metadata> {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;
  const decodedSlug = decodeURIComponent(slug);
  const websiteData = await fetchWebsiteData();
  const { seo, name: websiteName } = websiteData.attributes;

  const pageTitle = `${decodedSlug} 导演作品在线观看 - 第${pageNumber}页`;
  const pageDescription = `探索 ${decodedSlug} 导演的精彩视频作品，第${pageNumber}页`;
  const pageUrl = `${seo.canonicalURL}/director/${slug}/${pageNumber}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: websiteName,
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

export default async function DirectorPage({
  params,
}: {
  params: { page: string[] };
}) {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20;
  const decodedSlug = decodeURIComponent(slug);

  const websiteData = await fetchWebsiteData();
  const { videos, totalPages } = await fetchVideos(
    "director",
    decodedSlug,
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
    name: `${decodedSlug} 作品在线观看 - 第${pageNumber}页`,
    description: `探索 ${decodedSlug} 导演的精彩视频作品，第${pageNumber}页`,
    url: `${seo.canonicalURL}/director/${slug}/${pageNumber}`,
    websiteName,
    websiteUrl: seo.canonicalURL,
    itemCount: videos.length,
    items: videos,
    aboutName: decodedSlug,
    aboutType: "Person",
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
          <h1 className={title()}>{decodedSlug} 作品在线观看</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            探索 {decodedSlug} 导演的精彩视频作品
          </h2>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video: Video) => (
              <VideoCard
                key={video.id}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <PaginationComponent
            basePath="/director"
            pageNumber={pageNumber}
            slug={slug}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
}
