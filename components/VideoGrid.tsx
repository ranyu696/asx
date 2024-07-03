import React from "react";

import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";

interface VideoGridProps {
  videos: Video[];
  websiteImageURL: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, websiteImageURL }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {videos.map((video: Video) => (
        <VideoCard
          key={video.id}
          video={video}
          websiteImageURL={websiteImageURL}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
