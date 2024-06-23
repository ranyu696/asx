"use client"; // 确保该组件在客户端渲染

import React, { useEffect, useState } from "react";

import VideoCard from "./VideoCard";

interface Video {
  id: string;
  attributes: {
    aka: string;
    originalname: string;
    poster2: {
      url: string;
      width: number;
      height: number;
    };
    duration: string;
  };
}

interface RecommendedVideosProps {
  relatedVideosLast6: Video[];
  websiteImageURL: string;
}

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({
  relatedVideosLast6,
  websiteImageURL,
}) => {
  const [isLgScreen, setIsLgScreen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsLgScreen(window.innerWidth >= 1024);
      };

      handleResize(); // 初始化时检查屏幕宽度

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  if (!isLgScreen) {
    return null; // 如果屏幕宽度小于 lg，不渲染组件
  }

  return (
    <div className="lg:w-1/4 lg:pl-8 mt-8 lg:mt-0">
      <h2 className="text-xl font-bold mb-4">推荐视频</h2>
      <div className="space-y-4">
        <ul className="grid grid-cols-1 gap-4">
          {relatedVideosLast6.map((video: Video) => (
            <li key={video.id}>
              <VideoCard video={video} websiteImageURL={websiteImageURL} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendedVideos;
