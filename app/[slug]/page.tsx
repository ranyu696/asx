import type { Metadata } from "next";

import { Suspense } from "react";
import Script from "next/script";
import { notFound } from "next/navigation";

import VideoPlayer from "@/components/VideoPlayer";
import VideoInfo from "@/components/VideoInfo";
import VideoScreenshots from "@/components/VideoScreenshots";
import RelatedVideos from "@/components/RelatedVideos";
import RecommendedVideos from "@/components/RecommendedVideos";
import {
  VideoPlayerSkeleton,
  VideoInfoSkeleton,
  VideoScreenshotsSkeleton,
  RelatedVideosSkeleton,
  RecommendedVideosSkeleton,
} from "@/components/Skeleton";
import {
  fetchVideoData,
  fetchWebsiteData,
  fetchRelatedVideos,
} from "@/config/api";
import { generateAntiTheftUrl, generateVideoJsonLd } from "@/config/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const video = await fetchVideoData(params.slug);
    const websiteData = await fetchWebsiteData();

    const actors = video.attributes.actors.data
      .map((actor) => actor.attributes.name)
      .join(", ");
    const tags = video.attributes.tags.data
      .map((tag) => tag.attributes.name)
      .join(", ");
    const category = video.attributes.category.data.attributes.name;

    return {
      title: video.attributes.originalname || "默认标题",
      description: video.attributes.summary || "默认描述",
      keywords: `${actors}, ${tags}, ${category}`,
      alternates: {
        canonical: video.attributes.aka || "",
      },
      openGraph: {
        type: "video.movie",
        url: video.attributes.aka || "",
        title: video.attributes.originalname || "默认标题",
        description: video.attributes.summary || "默认描述",
        images: [
          {
            url: websiteData.attributes.imageURL + video.attributes.poster,
            width: 800,
            height: 600,
            alt: video.attributes.originalname,
          },
          {
            url: websiteData.attributes.imageURL + video.attributes.poster2.url,
            width: video.attributes.poster2?.width || 800,
            height: video.attributes.poster2?.height || 600,
            alt: video.attributes.originalname,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: `@${websiteData.attributes.Twitter}`,
        title: video.attributes.originalname || "默认标题",
        description: video.attributes.summary || "默认描述",
        images: [
          websiteData.attributes.imageURL + video.attributes.poster2.url,
        ],
      },
      robots: {
        index: true,
        follow: true,
        noarchive: true,
      },
    };
  } catch (error) {
    return {
      title: "视频不可用",
      description: "无法加载视频信息",
    };
  }
}

export default async function VideoPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const video = await fetchVideoData(params.slug);
    const websiteData = await fetchWebsiteData();
    const relatedVideos = await fetchRelatedVideos(video.attributes.tags.data);

    const antiTheftUrl = generateAntiTheftUrl(
      websiteData.attributes.currentTimestamp,
      websiteData.attributes.counts,
      video.attributes.m3u8paths.path,
      websiteData.attributes.efvtoken,
    );

    const jsonLd = generateVideoJsonLd(video, websiteData);

    return (
      <section className="lg:flex">
        <Script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          id="ld+json"
          type="application/ld+json"
        />
        <div className="lg:w-3/4">
          <Suspense fallback={<VideoPlayerSkeleton />}>
            <VideoPlayer
              title={video.attributes.originalname}
              videoId={video.id}
              videoPoster={`${websiteData.attributes.imageURL}${video.attributes.poster2.url}`}
              videoURL={`${websiteData.attributes.videoURL}${antiTheftUrl}`}
            />
          </Suspense>

          <Suspense fallback={<VideoInfoSkeleton />}>
            <VideoInfo video={video} />
          </Suspense>

          <Suspense fallback={<VideoScreenshotsSkeleton />}>
            <VideoScreenshots
              screenshots={video.attributes.screenshots}
              websiteImageURL={websiteData.attributes.imageURL}
            />
          </Suspense>

          <Suspense fallback={<RelatedVideosSkeleton />}>
            <RelatedVideos
              videos={relatedVideos.slice(0, 12)}
              websiteImageURL={websiteData.attributes.imageURL}
            />
          </Suspense>
        </div>

        <Suspense fallback={<RecommendedVideosSkeleton />}>
          <RecommendedVideos
            videos={relatedVideos.slice(12)}
            websiteImageURL={websiteData.attributes.imageURL}
          />
        </Suspense>
      </section>
    );
  } catch (error) {
    notFound();
  }
}
