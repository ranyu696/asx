import qs from "qs";

import {
  Video,
  WebsiteData,
  Category,
  Actor,
  Tag,
  VideoListResponse,
} from "@/types";

const BASE_URL = "https://strapi.xiaoxinlook.cc/api";

// 改进 StrapiResponse 类型以更好地匹配实际返回的数据结构
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
}

// 添加通用的查询参数类型
interface QueryParams {
  filters?: any;
  pagination?: { page: number; pageSize: number };
  fields?: string[];
  populate?: any;
  sort?: string[];
}

// 改进 fetchAPI 函数，使用泛型来确保返回类型的正确性
async function fetchAPI<T>(
  endpoint: string,
  params: QueryParams = {},
): Promise<StrapiResponse<T>> {
  const queryString = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;

  console.log(`Fetching URL: ${url}`);

  const res = await fetch(url);

  if (!res.ok) {
    const errorBody = await res.text();

    throw new Error(
      `API call failed: ${res.status} ${res.statusText}\nURL: ${url}\nResponse: ${errorBody}`,
    );
  }

  return res.json();
}

// 添加一个通用的获取数据函数，减少重复代码
async function fetchData<T>(
  endpoint: string,
  params: QueryParams = {},
): Promise<T> {
  const response = await fetchAPI<T>(endpoint, params);

  if (!response.data) {
    throw new Error(`No data returned from ${endpoint}`);
  }

  return Array.isArray(response.data) ? response.data : (response.data as T);
}

// 重构 fetchCategoryData 函数
export async function fetchCategoryData(slug: string): Promise<Category> {
  const categories = await fetchData<Category[]>("/categories", {
    filters: { slug: { $eq: slug } },
  });

  if (categories.length === 0) {
    throw new Error(`Category not found: ${slug}`);
  }

  return categories[0];
}

// 重构 fetchVideos 函数
export async function fetchVideos(
  type: "category" | "director" | "studio" | "actor" | "tag",
  id: number | string,
  pageNumber: number,
  pageSize: number,
): Promise<{
  videos: Video[];
  totalPages: number;
}> {
  try {
    let filters;

    switch (type) {
      case "category":
        filters = { category: { id: { $eq: id } } };
        break;
      case "director":
        filters = { director: { $eq: id } };
        break;
      case "studio":
        filters = { studio: { $eq: id } };
        break;
      case "actor":
        filters = { actors: { id: { $eq: id } } };
        break;
      case "tag":
        filters = { tags: { id: { $eq: id } } };
        break;
      default:
        throw new Error(`Invalid type: ${type}`);
    }

    const params: QueryParams = {
      filters,
      pagination: { page: pageNumber, pageSize },
      fields: ["originalname", "duration", "aka"],
      populate: {
        poster2: {
          fields: ["url", "width", "height"],
        },
        category: {
          fields: ["name"],
        },
      },
    };

    const response = await fetchAPI<Video[]>("/videos", params);

    if (!response.data || !response.meta || !response.meta.pagination) {
      throw new Error("Invalid video data");
    }

    return {
      videos: response.data,
      totalPages: response.meta.pagination.pageCount,
    };
  } catch (error) {
    console.error("Error in fetchVideos:", error);
    throw error;
  }
}

// 重构 fetchActorData 函数
export async function fetchActorData(slug: string): Promise<Actor> {
  const decodedSlug = decodeURIComponent(slug);
  const actors = await fetchData<Actor[]>("/actors", {
    filters: { name: { $eq: decodedSlug } },
  });

  if (actors.length === 0) {
    throw new Error(`Actor not found: ${decodedSlug}`);
  }

  return actors[0];
}

// 重构 fetchTagData 函数
export async function fetchTagData(slug: string): Promise<Tag> {
  const decodedSlug = decodeURIComponent(slug);
  const tags = await fetchData<Tag[]>("/tags", {
    filters: { name: { $eq: decodedSlug } },
  });

  if (tags.length === 0) {
    throw new Error(`Tag not found: ${decodedSlug}`);
  }

  return tags[0];
}

// 重构 fetchVideoData 函数
export async function fetchVideoData(slug: string): Promise<Video> {
  const videos = await fetchData<Video[]>("/videos", {
    filters: { aka: { $eq: slug } },
    populate: "*",
  });

  if (videos.length === 0) {
    throw new Error(`Video not found: ${slug}`);
  }

  return videos[0];
}

// 重构 fetchWebsiteData 函数
export async function fetchWebsiteData(): Promise<WebsiteData> {
  return await fetchData<WebsiteData>("/websites/1", {
    fields: [
      "name",
      "imageURL",
      "videoURL",
      "efvtoken",
      "counts",
      "currentTimestamp",
    ],
    populate: {
      categories: {
        fields: ["id", "name"],
      },
      seo: {
        populate: ["metaSocial"],
      },
    },
  });
}

// 重构 fetchRelatedVideos 函数
export async function fetchRelatedVideos(tags: Tag[]): Promise<Video[]> {
  if (!tags || tags.length === 0) {
    console.warn("No tags provided for fetchRelatedVideos");

    return [];
  }

  const tagNames = tags.map((tag) => tag.attributes?.name).filter(Boolean);

  if (tagNames.length === 0) {
    console.warn("No valid tag names found");

    return [];
  }

  try {
    const tagsResponse = await fetchAPI<Tag[]>("/tags", {
      filters: { name: { $in: tagNames } },
      populate: { videos: { fields: ["id"] } },
    });

    if (!tagsResponse.data || tagsResponse.data.length === 0) {
      console.warn("No tags found matching the provided names");

      return [];
    }

    const allVideos = tagsResponse.data.flatMap(
      (tag: Tag) => tag.attributes?.videos?.data || [],
    );
    const shuffledVideos = allVideos.sort(() => 0.5 - Math.random());
    const selectedVideoIds = shuffledVideos
      .slice(0, 18)
      .map((video: { id: string }) => video.id);

    if (selectedVideoIds.length === 0) {
      console.warn("No related videos found");

      return [];
    }

    return await fetchData<Video[]>("/videos", {
      filters: { id: { $in: selectedVideoIds } },
      sort: ["createdAt:desc"],
      fields: ["originalname", "duration", "aka", "createdAt", "summary"],
      populate: {
        poster2: {
          fields: ["url", "width", "height"],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching related videos:", error);

    return [];
  }
}

// 重构 fetchVideosByTag 函数
export async function fetchVideosByTag(
  tagName: string,
  limit: number,
): Promise<Video[]> {
  return await fetchData<Video[]>("/videos", {
    filters: { tags: { name: { $eq: tagName } } },
    pagination: { page: 1, pageSize: limit },
    fields: ["originalname", "duration", "aka"],
    populate: {
      poster2: { fields: ["url", "width", "height"] },
      category: { fields: ["name"] },
    },
  });
}

// 重构 fetchLatestVideos 函数
export async function fetchLatestVideos(limit: number): Promise<Video[]> {
  return await fetchData<Video[]>("/videos", {
    sort: ["createdAt:desc"],
    filters: { category: { id: { $eq: 1 } } },
    pagination: { page: 1, pageSize: limit },
    fields: ["originalname", "duration", "aka"],
    populate: {
      poster2: { fields: ["url", "width", "height"] },
      category: { fields: ["name"] },
    },
  });
}

// 重构 fetchPopularVideos 函数，添加类别过滤
export async function fetchPopularVideos(
  startDate: string,
  limit: number,
  websiteCategories: number[],
): Promise<Video[]> {
  return await fetchData<Video[]>("/videos", {
    sort: ["count:desc"],
    filters: {
      createdAt: { $gte: startDate },
      category: {
        id: {
          $in: websiteCategories,
        },
      },
    },
    pagination: { page: 1, pageSize: limit },
    fields: ["originalname", "duration", "aka"],
    populate: {
      poster2: { fields: ["url", "width", "height"] },
      category: { fields: ["name"] },
    },
  });
}

// 重构 fetchWebsiteMetadata 函数
export async function fetchWebsiteMetadata(): Promise<WebsiteData> {
  return await fetchData<WebsiteData>("/websites/1", {
    fields: ["name"],
    populate: {
      seo: {
        populate: [
          "metaSocial",
          "BasicFields",
          "formatDetection",
          "metaRobots",
        ],
      },
    },
  });
}

// 重构 fetchCategories 函数
export async function fetchCategories(): Promise<Category[]> {
  return await fetchData<Category[]>("/categories", {
    populate: "subcategories.*",
    filters: {
      isCategory: { $eq: true },
      website: { $in: [1] },
    },
  });
}

// 重构 fetchWebsiteDetails 函数
export async function fetchWebsiteDetails(): Promise<WebsiteData> {
  return await fetchData<WebsiteData>("/websites/1", {
    fields: [
      "googleAnalyticsId",
      "email",
      "PPURL",
      "MetrikaID",
      "advertisementCode",
      "announcement",
    ],
    populate: ["links"],
  });
}

// 重构 searchVideos 函数
export async function searchVideos(
  searchSlug: string,
  websiteCategories: number[],
  pageNumber: number,
  pageSize: number,
): Promise<VideoListResponse> {
  const response = await fetchAPI<Video[]>("/videos", {
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
  });

  return {
    data: response.data,
    meta: {
      pagination: response.meta?.pagination || {
        page: pageNumber,
        pageSize: pageSize,
        pageCount: Math.ceil(
          (response.meta?.pagination?.total || 0) / pageSize,
        ),
        total: response.meta?.pagination?.total || 0,
      },
    },
  };
}
