import type { Metadata } from "next";

import { createHash } from "crypto";

import Image from "next/image";
import qs from "qs";
import { Link } from "@nextui-org/link";
import { Key } from "react";
import { Chip } from "@nextui-org/chip";
import {
  BiAlarm,
  BiLogoVisualStudio,
  BiSolidBookmark,
  BiSolidCalendar,
  BiSolidCategory,
} from "react-icons/bi";
import { MdRecentActors } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import Script from "next/script";

import RecommendedVideos from "@/components/RecommendedVideos";
import VideoCard from "@/components/VideoCard";
import VideoSummary from "@/components/VideoSummary";
import VideoPlayer from "@/components/VideoPlayer";

function generateAntiTheftUrl(
  currentTimestamp: string,
  counts: string,
  url: string,
  tokenKey: string,
) {
  const nowstamp = Date.now(); // 获取当前时间的毫秒数
  const dutestamp = nowstamp + `${currentTimestamp}`; // 60秒后过期
  const playCount = `${counts}`; // 允许播放次数
  const tokenUrl = `${url}&counts=${playCount}&timestamp=${dutestamp}${tokenKey}`;
  const md5 = createHash("md5");
  const md5Token = md5.update(tokenUrl).digest("hex");

  return `${url}?counts=${playCount}&timestamp=${dutestamp}&key=${md5Token}`;
}
// 从字符串中提取分钟数并转换为数字
function extractMinutes(durationStr: string): number {
  const match = durationStr.match(/(\d+)\s*分钟/);

  return match ? parseInt(match[1], 10) : NaN;
}

// 将分钟数转换为 ISO 8601 格式
function convertMinutesToISO8601(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `PT${hours}H${remainingMinutes}M`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // 从 API 获取视频数据
  const response = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[aka][$eq]=${params.slug}&populate=*`,
  );
  const data = await response.json();
  const video = data?.data?.[0]?.attributes || {};

  // 从 API 获取网站数据
  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields[]=imageURL&fields[]=Twitter",
  );
  const dataWebsite = await resWebsite.json();
  const websiteImageURL = dataWebsite.data.attributes.imageURL;
  const websiteTwitter = dataWebsite.data.attributes.Twitter;
  // 获取演员名字
  const actors =
    video?.actors?.data
      .map((actor: { attributes: { name: any } }) => actor.attributes.name)
      .join(", ") || "未知演员";
  // 获取标签
  const tags =
    video?.tags?.data
      .map((tag: { attributes: { name: any } }) => tag.attributes.name)
      .join(", ") || "无标签";
  // 获取分类
  const category = video?.category?.data?.attributes?.name || "无分类";

  return {
    title: video.originalname || "默认标题",
    description: video.summary || "默认描述",
    keywords: `${actors}, ${tags}, ${category}`,
    alternates: {
      canonical: video.aka || "",
    },
    openGraph: {
      type: "video.movie",
      url: video.aka || "",
      title: video.originalname || "默认标题",
      description: video.summary || "默认描述",
      images: [
        {
          url: websiteImageURL + video.poster,
          width: 800,
          height: 600,
          alt: video.originalname,
        },
        {
          url: websiteImageURL + video.poster2.url,
          width: video.poster2?.width || 800,
          height: video.poster2?.height || 600,
          alt: video.originalname,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${websiteTwitter}`,
      title: video.originalname || "默认标题",
      description: video.summary || "默认描述",
      images: [websiteImageURL + video.poster2.url],
    },
    robots: {
      index: true,
      follow: true,
      noarchive: true,
    },
  };
}
export default async function VideoPage({
  params,
}: {
  params: { slug: string };
}) {
  // 获取视频详情
  const videoResponse = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[aka][$eq]=${params.slug}&populate=*`,
  );
  const videoData = await videoResponse.json();
  const video = videoData.data[0]; // 取出第一个视频对象

  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields[]=imageURL&fields[]=videoURL&fields[]=efvtoken&fields[]=counts&fields[]=currentTimestamp&populate[seo][populate][0]=metaSocial",
  );
  const dataWebsite = await resWebsite.json();
  const websiteImageURL = dataWebsite.data.attributes.imageURL;
  const websiteVideoURL = dataWebsite.data.attributes.videoURL;
  const seo = dataWebsite.data.attributes.seo;
  const efvtoken = dataWebsite.data.attributes.efvtoken;
  const counts = dataWebsite.data.attributes.counts;
  const currentTimestamp = dataWebsite.data.attributes.currentTimestamp;
  const antiTheftUrl = generateAntiTheftUrl(
    currentTimestamp,
    counts,
    video.attributes.m3u8paths.path,
    efvtoken,
  );

  // Generate JSON-LD structured data
  const durationStr = video.attributes.duration || "";
  const minutes = extractMinutes(durationStr);
  const durationISO8601 = !isNaN(minutes)
    ? convertMinutesToISO8601(minutes)
    : "Unknown Duration";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: video.attributes.originalname,
    description: video.attributes.summary,
    image: [
      `${websiteImageURL}${video.attributes.poster}`,
      `${websiteImageURL}${video.attributes.poster2.url}`,
    ],
    actor:
      video.attributes.actors.data.map(
        (actor: { attributes: { name: string } }) => ({
          "@type": "Person",
          name: actor.attributes.name,
        }),
      ) || [],
    director: {
      "@type": "Person",
      name: video.attributes.director || "Unknown Director",
    },
    duration: durationISO8601,
    genre:
      video.attributes.tags.data
        .map((tag: { attributes: { name: string } }) => tag.attributes.name)
        .join(", ") || "Unknown Genre",
    datePublished: video.attributes.createdAt,
    url: `${seo.canonicalURL}/${params.slug}`,
  };
  // 提取当前视频的标签名
  const tagNames = video.attributes.tags.data.map(
    (tag: { attributes: { name: any } }) => tag.attributes.name,
  );

  // 构建查询参数
  const tagParams = {
    filters: {
      name: {
        $in: tagNames,
      },
    },
    populate: {
      videos: {
        fields: ["id"],
      },
    },
  };

  // 将查询参数转换为字符串
  const tagQueryString = qs.stringify(tagParams, { encodeValuesOnly: true });
  const tagsResponse = await fetch(
    `https://strapi.xiaoxinlook.cc/api/tags?${tagQueryString}`,
  );
  const tagsData = await tagsResponse.json();

  // 提取所有的 videos 数组并合并为一个数组
  const allVideos = tagsData.data.flatMap(
    (tag: { attributes: { videos: { data: any } } }) =>
      tag.attributes.videos.data,
  );

  // 对合并后的数组进行随机排序
  const shuffledVideos = allVideos.sort(() => 0.5 - Math.random());

  // 从随机排序后的数组中截取前 9 个元素
  const selectedVideos = shuffledVideos.slice(0, 18);

  // 从截取的 9 个元素中提取 id 字段的值
  const selectedVideoIds = selectedVideos.map((video: { id: any }) => video.id);
  // 构建查询参数
  const videoParams = {
    filters: {
      id: {
        $eqi: selectedVideoIds,
      },
    },
    sort: ["createdAt:desc"],
    fields: ["originalname", "duration", "aka"],
    populate: {
      poster2: {
        fields: ["url", "width", "height"],
      },
    },
  };

  // 将查询参数转换为字符串
  const videoQueryString = qs.stringify(videoParams, {
    encodeValuesOnly: true,
  });

  // 发送请求获取相关视频信息
  const relatedVideosResponse = await fetch(
    `https://strapi.xiaoxinlook.cc/api/videos?${videoQueryString}`,
  );
  const relatedVideosData = await relatedVideosResponse.json();

  const relatedVideos = relatedVideosData.data;
  // 将 relatedVideos 分成前 12 个和后 8 个视频
  const relatedVideosFirst12 = relatedVideos.slice(0, 12);
  const relatedVideosLast6 = relatedVideos.slice(12);

  return (
    <section className="lg:flex">
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        id="ld+json"
        type="application/ld+json"
      />
      <div className="lg:w-3/4">
        {/* 播放器 */}
        <div className="border-2 border-black">
          <VideoPlayer
            videoId={video.id}
            title={video.attributes.originalname}
            videoPoster={`${websiteImageURL}${video.attributes.poster2.url}`}
            videoURL={`${websiteVideoURL}${antiTheftUrl}`}
          />
        </div>

        {/* 影视信息 */}
        <div className="mt-8">
          <h1 className="text-xl md:text-3xl font-bold mb-4">
            {video.attributes.originalname}
          </h1>

          <div className="flex flex-wrap items-center space-x-2">
            <Chip
              radius="sm"
              startContent={<BiSolidCalendar size={18} />}
            >
              {video.attributes.year}
            </Chip>
            <Chip
              radius="sm"
              startContent={<BiAlarm size={18} />}
            >
              {video.attributes.duration}
            </Chip>
            <Chip
              radius="sm"
              startContent={<BiSolidBookmark size={18} />}
            >
              {video.attributes.aka}
            </Chip>
            <Chip
              radius="sm"
              startContent={<BiSolidCategory size={18} />}
            >
              {video.attributes.category.data.attributes.name}
            </Chip>
          </div>
          {/* 添加片商 */}
          <div className="mt-4 flex items-center">
            <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center">
              <BiLogoVisualStudio className="mr-1" size={18} />
              片商:
            </span>
            <span className="text-gray-600 ml-2">
              <Link
                isExternal
                showAnchorIcon
                href={`/studio/${video.attributes.studio}`}
              >
                {video.attributes.studio}
              </Link>
            </span>
          </div>
          {/* 添加导演 */}
          <div className="mt-4 flex items-center">
            <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center">
              <FaUserTie className="mr-1" size={18} />
              导演:
            </span>
            <span className="text-gray-600 ml-2">
              <Link
                isExternal
                showAnchorIcon
                href={`/director/${video.attributes.director}`}
              >
                {video.attributes.director}
              </Link>
            </span>
          </div>
          {/* 添加演员 */}
          <div className="mt-4 flex flex-wrap items-center">
            <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center">
              <MdRecentActors className="mr-1" size={18} />
              演员:
            </span>
            {video.attributes.actors.data.map(
              (actor: { id: number; attributes: { name: string } }) => (
                <span key={actor.id} className="text-gray-600 ml-2">
                  <Link
                    isExternal
                    showAnchorIcon
                    href={`/actor/${actor.attributes.name}`}
                  >
                    {actor.attributes.name}
                  </Link>
                </span>
              ),
            )}
          </div>
          {/* 添加标签 */}
          <div className="mt-4 flex flex-wrap items-center">
            <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center">
              <FaTags className="mr-1" size={18} />
              标签:
            </span>
            {video.attributes.tags.data.map(
              (tag: { id: number; attributes: { name: string } }) => (
                <span key={tag.id} className="text-gray-600 ml-2">
                  <Link
                    isExternal
                    showAnchorIcon
                    href={`/tag/${tag.attributes.name}`}
                  >
                    {tag.attributes.name}
                  </Link>
                </span>
              ),
            )}
          </div>
          <VideoSummary Summary={video.attributes.summary} />
        </div>

        {/* 视频截图 */}
        <div className="mt-8 overflow-x-auto">
          <div className="flex space-x-4 whitespace-nowrap">
            {video.attributes.screenshots.map(
              (
                screenshot: { id: Key | null | undefined; url: any },
                index: number,
              ) => (
                <Image
                  key={screenshot.id}
                  alt={`视频截图 ${index + 1}`}
                  className="w-40 h-24 object-cover rounded"
                  height={96}
                  src={`${websiteImageURL}${screenshot.url}`}
                  width={160}
                />
              ),
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">相关视频</h2>
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedVideosFirst12.map((video: any) => (
                  <VideoCard key={video.id} video={video} websiteImageURL={websiteImageURL} />
              ))}
            </div>
        </div>
      </div>

      {/* 推荐视频 */}
      <RecommendedVideos
        relatedVideosLast6={relatedVideosLast6}
        websiteImageURL={websiteImageURL}
      />
      {/* JSON-LD structured data */}
    </section>
  );
}
