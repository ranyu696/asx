import { notFound } from "next/navigation";
import Script from "next/script";
import { Metadata } from "next";

import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/components/VideoCard";
import PaginationComponent from "@/components/Pagination";

export async function generateMetadata({
  params,
}: {
  params: { page: string[] };
}): Promise<Metadata> {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1;

  // 获取分类数据
  const resCategory = await fetch(
    `https://strapi.xiaoxinlook.cc/api/categories?filters[slug][$eq]=${slug}`,
  );
  const dataCategory = await resCategory.json();

  if (!dataCategory.data || dataCategory.data.length === 0) {
    notFound();
  }
  const CategoryName = dataCategory.data[0].attributes.name;

  return {
    title: `${CategoryName} 在线观看 - 第${pageNumber}页`,
    description: `探索 ${CategoryName} 类别中的精彩视频，第${pageNumber}页`,
    openGraph: {
      title: `${CategoryName} 在线观看 - 第${pageNumber}页`,
      description: `探索 ${CategoryName} 类别中的精彩视频，第${pageNumber}页`,
      type: "website",
    },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: { page: string[] };
}) {
  const [slug, page] = params.page;
  const pageNumber = parseInt(page) || 1; // 当前页码
  const pageSize = 20; // 每页视频数量
  // 获取分类数据
  const resCategory = await fetch(
    `https://strapi.xiaoxinlook.cc/api/categories?filters[slug][$eq]=${slug}`,
  );
  const dataCategory = await resCategory.json();

  if (!dataCategory.data || dataCategory.data.length === 0) {
    // 如果分类数据不存在或为空数组，返回 404 页面
    notFound();
  }
  const CategoryName = dataCategory.data[0].attributes.name;

  // 获取域名
  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields[0]=name&fields=imageURL&populate[seo][populate][0]=metaSocial",
  );
  const dataWebsite = await resWebsite.json();
  const websiteImageURL = dataWebsite.data.attributes.imageURL;
  const seo = dataWebsite.data.attributes.seo;
  const websiteName = dataWebsite.data.attributes.name;

  // 获取视频
  const categoryId = dataCategory.data[0].id;

  const resVideos = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[category][id][$eq]=${categoryId}&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}&fields[0]=originalname&fields[1]=duration&fields[2]=aka&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name`,
  );
  const dataVideos = await resVideos.json();
  const Videos = dataVideos.data;

  // 计算总页数
  const totalCount = dataVideos.meta.pagination.total;
  const totalPages = Math.ceil(totalCount / pageSize);
  // 构建JSON-LD结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${CategoryName} 在线观看 - 第${pageNumber}页`,
    description: `探索 ${CategoryName} 类别中的精彩视频，第${pageNumber}页`,
    url: `${seo.canonicalURL}/category/${slug}/${pageNumber}`,
    isPartOf: {
      "@type": "WebSite",
      name: websiteName,
      url: seo.canonicalURL,
    },
    about: {
      "@type": "Thing",
      name: CategoryName,
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

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="ld+json"
        type="application/ld+json"
      />
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{CategoryName} 在线观看</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            探索 {CategoryName} 类别中的精彩视频
          </h2>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
            basePath="/category"
            pageNumber={pageNumber}
            slug={slug}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
}
