import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export interface Video {
  originalname: string;
  aka: string;
  summary: string;
  moviepath: string;
  actors: Actor[];
  tags: Tag[];
  category: Category;
  language: string;
  firstScreen: string;
  poster: string;
  previewvideo: string;
  gif: string;
  video_id: string;
  m3u8paths: M3U8Paths;
  originaltitle: string;
  studio: string;
  serie: string;
  director: string;
  screenshots: Screenshot[];
  count: number;
  isEpisode: boolean;
  duration: string;
  releaseDate: Date;
  year: number;
}

interface M3U8Paths {
  hd: string;
  path: string;
}

interface Screenshot {
  url: string;
}

interface Actor {
  // Actor 的字段定义
}

interface Tag {
  // Tag 的字段定义
}

interface Category {
  // Category 的字段定义
}
