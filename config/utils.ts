import { createHash } from "crypto";

import { Video, WebsiteData } from "@/types";

export function generateAntiTheftUrl(
  currentTimestamp: string,
  counts: string,
  url: string,
  tokenKey: string,
): string {
  const nowstamp = Date.now();
  const dutestamp = nowstamp + Number(currentTimestamp);
  const playCount = counts;
  const tokenUrl = `${url}&counts=${playCount}&timestamp=${dutestamp}${tokenKey}`;
  const md5 = createHash("md5");
  const md5Token = md5.update(tokenUrl).digest("hex");

  return `${url}?counts=${playCount}&timestamp=${dutestamp}&key=${md5Token}`;
}
export function extractMinutes(durationStr: string): number {
  const match = durationStr.match(/(\d+)\s*分钟/);

  return match ? parseInt(match[1], 10) : NaN;
}

export function convertMinutesToISO8601(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `PT${hours}H${remainingMinutes}M`;
}

interface JsonLdParams {
  type: string;
  name: string;
  description: string;
  url: string;
  websiteName: string;
  websiteUrl: string;
  itemCount: number;
  items: Video[];
  aboutName: string;
  aboutType: string;
}

export function generateJsonLd(params: JsonLdParams) {
  const {
    type,
    name,
    description,
    url,
    websiteName,
    websiteUrl,
    itemCount,
    items,
    aboutName,
    aboutType,
  } = params;

  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: websiteName,
      url: websiteUrl,
    },
    about: {
      "@type": aboutType,
      name: aboutName,
    },
    numberOfItems: itemCount,
    itemListElement: items.map((video, index) => {
      const durationStr = video.attributes.duration || "";
      const minutes = extractMinutes(durationStr);
      const durationISO8601 = !isNaN(minutes)
        ? convertMinutesToISO8601(minutes)
        : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "VideoObject",
          name: video.attributes.originalname,
          duration: durationISO8601,
          thumbnailUrl: video.attributes.poster2.url,
          uploadDate:
            video.attributes.createdAt || video.attributes.publishedAt,
          description:
            video.attributes.summary ||
            `${video.attributes.originalname} - ${aboutName}`,
        },
      };
    }),
  };
}
export function generateVideoJsonLd(
  video: Video,
  websiteData: WebsiteData,
): object {
  const durationStr = video.attributes.duration || "";
  const minutes = extractMinutes(durationStr);
  const durationISO8601 = !isNaN(minutes)
    ? convertMinutesToISO8601(minutes)
    : "Unknown Duration";

  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: video.attributes.originalname,
    description: video.attributes.summary,
    image: [
      `${websiteData.attributes.imageURL}${video.attributes.poster}`,
      `${websiteData.attributes.imageURL}${video.attributes.poster2.url}`,
    ],
    actor: video.attributes.actors.data.map((actor) => ({
      "@type": "Person",
      name: actor.attributes.name,
    })),
    director: {
      "@type": "Person",
      name: video.attributes.director || "Unknown Director",
    },
    duration: durationISO8601,
    genre:
      video.attributes.tags.data.map((tag) => tag.attributes.name).join(", ") ||
      "Unknown Genre",
    datePublished: video.attributes.createdAt,
    url: `${websiteData.attributes.seo?.canonicalURL || ""}/${video.attributes.aka}`,
  };
}
// 获取本周开始时间的函数
export function getStartOfWeek(): string {
  const currentDate = new Date();
  const startOfWeek = new Date(
    currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
  );

  return startOfWeek.toISOString();
}

// 获取30天前的时间的函数
export function getThirtyDaysAgo(): string {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(
    currentDate.setDate(currentDate.getDate() - 30),
  );

  return thirtyDaysAgo.toISOString();
}
