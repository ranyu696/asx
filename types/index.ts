import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export interface Actor {
  id: number;
  attributes: {
    name: string;
    // 其他 Actor 相关字段
  };
}

export interface Tag {
  id: number;
  attributes: {
    name: string;
    videos: {
      data: { id: string }[];
    };
  };
}

export interface SubCategory {
  id: number; // 根据实际情况选择 string 或 number
  attributes: {
    name: string;
    slug: string;
    length: number;
    // 添加其他 subCategory 可能有的属性
  };
}

export interface Category {
  id: number; // 根据实际情况选择 string 或 number
  attributes: {
    name: string;
    slug: string;
    videos: {
      data: Video[];
    };
    subcategories?: {
      data: SubCategory[];
    };
  };
}

interface M3u8Path {
  hd: string;
  path: string;
}

interface Poster2 {
  url: string;
  height: number;
  width: number;
}

// 主要的 Video 接口
export interface Video {
  id: string;
  attributes: {
    originalname: string;
    aka: string;
    summary: string;
    moviepath: string;
    actors: {
      data: Actor[];
    };
    tags: {
      data: Tag[];
    };
    category: {
      data: Category;
    };
    language: string;
    firstScreen: string;
    poster: string;
    previewvideo: string;
    gif: string;
    video_id: string;
    m3u8paths: M3u8Path;
    poster2: Poster2;
    episodes: {
      videos: {
        data: Video[];
      };
    };
    originaltitle: string;
    studio: string;
    serie: string;
    director: string;
    screenshots: Screenshot[];
    count: number;
    isEpisode: boolean;
    duration: string;
    releaseDate: string; // 或者使用 Date 类型，取决于您如何处理日期
    year: number;
    // 添加 Strapi 的元数据字段
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

// 如果需要，可以为列表响应创建一个接口
export interface VideoListResponse {
  data: Video[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 单个视频响应的接口
export interface VideoResponse {
  data: Video;
  meta: {};
}
export interface ApiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
export interface WebsiteData {
  id: number;
  attributes: {
    name: string;
    imageURL: string;
    videoURL: string;
    efvtoken: string;
    counts: string;
    currentTimestamp: string;
    Twitter: string;
    googleAnalyticsId: string;
    email: string;
    PPURL: string;
    MetrikaID: number;
    advertisementCode: string;
    links: {
      data: Link[]; // 这里定义 links 包含 data 属性，它是一个 Link 数组
    };
    categories: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
        };
      }>;
    };
    seo: {
      canonicalURL: string;
      metaSocial: Array<{
        socialNetwork: string;
        title: string;
        description: string;
      }>;
      metaRobots: {
        index: boolean;
        follow: boolean;
        nocache: boolean;
      };
      templateTitle: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string;
      BasicFields: {
        generator: string;
        applicationName: string;
        referrer: null | ReferrerEnum;
        authors: string;
        creator: string;
        publisher: string;
      };
      formatDetection: {
        email: boolean;
        address: boolean;
        telephone: boolean;
      };
    };
  };
}
export interface Link {
  id: number;
  attributes: {
    order: number;
    name: string;
    url: string;
    target: boolean;
  };
}
export interface PageParams {
  page: string[];
}
export interface Screenshot {
  id: string;
  url: string;
}
