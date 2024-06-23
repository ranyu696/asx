import qs from "qs";
import { Metadata } from "next";
import Script from "next/script";

import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/components/VideoCard";
import PaginationComponent from "@/components/Pagination";

export async function generateMetadata({
  params,
}: {
  params: { page: string[] };
}): Promise<Metadata> {
  const [slug, page] = params.page;
  const searchSlug = decodeURIComponent(slug);
  const pageNumber = parseInt(page) || 1; // 当前页码

  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields=name&populate[seo][populate][0]=metaSocial",
  );
  const dataWebsite = await resWebsite.json();
  const websiteName = dataWebsite.data.attributes.name;
  const seo = dataWebsite.data.attributes.seo;

  return {
    title: `"${searchSlug}" 搜索结果 - 第${pageNumber}页`,
    description: `探索与 "${searchSlug}" 相关的视频，第${pageNumber}页`,
    openGraph: {
      title: `"${searchSlug}" 搜索结果 - 第${page}页 | ${websiteName}`,
      description: `探索与 "${searchSlug}" 相关的视频，第${pageNumber}页`,
      type: "website",
      url: `${seo.canonicalURL}/search/${slug}/${pageNumber}`,
    },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: { page: string[] };
}) {
  const [slug, page] = params.page;
  const searchSlug = decodeURIComponent(slug);
  const pageNumber = parseInt(page) || 1; // 当前页码
  const pageSize = 20;

  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields=imageURL&populate=categories&populate[seo][populate][0]=metaSocial",
  );
  const dataWebsite = await resWebsite.json();
  const websiteImageURL = dataWebsite.data.attributes.imageURL;
  const websiteCategories = dataWebsite.data.attributes.categories.data.map(
    (category: { id: any }) => category.id,
  );
  const seo = dataWebsite.data.attributes.seo;
  const websiteName = dataWebsite.data.attributes.name;

  const queryParams = {
    filters: {
      category: {
        id: {
          $in: websiteCategories,
        },
      },
      originalname: {
        $containsi: searchSlug,
      },
    },
    fields: ["originalname", "duration", "aka"],
    populate: {
      poster2: {
        fields: ["url", "width", "height"],
      },
      category: {
        fields: ["name"],
      },
    },
    pagination: {
      page: pageNumber,
      pageSize: pageSize,
    },
  };

  const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });

  const resVideos = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?${queryString}`,
  );
  const dataVideos = await resVideos.json();
  const Videos = dataVideos.data;

  const totalCount = dataVideos.meta.pagination.total;
  const totalPages = Math.ceil(totalCount / pageSize);

  // JSON-LD 结构化数据
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
    numberOfItems: Videos.length,
    itemListElement: Videos.map((video: any, index: number) => ({
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

  if (Videos.length === 0) {
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
            {Videos.map((video: any) => (
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
