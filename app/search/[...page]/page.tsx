import { Metadata } from "next";
import Script from "next/script";

import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/components/VideoCard";
import PaginationComponent from "@/components/Pagination";
import { PageParams } from "@/types";
import { fetchWebsiteData, searchVideos } from "@/config/api";

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const [slug, page] = params.page;
  const searchSlug = decodeURIComponent(slug);
  const pageNumber = parseInt(page) || 1;

  const websiteData = await fetchWebsiteData();
  const { name: websiteName, seo } = websiteData.attributes;

  return {
    title: `"${searchSlug}" 搜索结果 - 第${pageNumber}页`,
    description: `探索与 "${searchSlug}" 相关的视频，第${pageNumber}页`,
    openGraph: {
      title: `"${searchSlug}" 搜索结果 - 第${pageNumber}页 | ${websiteName}`,
      description: `探索与 "${searchSlug}" 相关的视频，第${pageNumber}页`,
      type: "website",
      url: `${seo.canonicalURL}/search/${slug}/${pageNumber}`,
    },
  };
}

export default async function SearchPage({ params }: { params: PageParams }) {
  const [slug, page] = params.page;
  const searchSlug = decodeURIComponent(slug);
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20;

  const websiteData = await fetchWebsiteData();
  const {
    imageURL: websiteImageURL,
    seo,
    name: websiteName,
  } = websiteData.attributes;
  const websiteCategories = websiteData.attributes.categories.data.map(
    (category) => category.id,
  );

  const videoData = await searchVideos(
    searchSlug,
    websiteCategories,
    pageNumber,
    pageSize,
  );
  const videos = videoData.data;

  const totalCount = videoData.meta.pagination.total;
  const totalPages = Math.ceil(totalCount / pageSize);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `"${searchSlug}" 搜索结果 - 第${pageNumber}页`,
    description: `探索与 "${searchSlug}" 相关的视频，第${pageNumber}页`,
    url: `${seo.canonicalURL}/search/${slug}/${pageNumber}`,
    isPartOf: {
      "@type": "WebSite",
      name: websiteName,
      url: seo.canonicalURL,
    },
    about: {
      "@type": "Thing",
      name: searchSlug,
    },
    numberOfItems: videos.length,
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.attributes.originalname,
        duration: video.attributes.duration,
        thumbnailUrl: video.attributes.poster2.url,
      },
    })),
  };

  if (videos.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>没有找到相关结果</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            抱歉，没有找到与&quot;{searchSlug}&quot; 相关的视频
          </h2>
        </div>
      </section>
    );
  }

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="ld+json"
        type="application/ld+json"
      />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{searchSlug} 搜索结果</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            探索 {searchSlug} 相关的精彩视频
          </h2>
        </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
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
            basePath={`/search/${slug}`}
            pageNumber={pageNumber}
            slug={slug}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
}
