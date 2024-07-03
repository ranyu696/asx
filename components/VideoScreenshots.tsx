import React from "react";
import Image from "next/image";

import { Screenshot } from "@/types";

interface VideoScreenshotsProps {
  screenshots: Screenshot[];
  websiteImageURL: string;
}

const VideoScreenshots: React.FC<VideoScreenshotsProps> = ({
  screenshots,
  websiteImageURL,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">视频截图</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {screenshots.map((screenshot, index) => (
          <Image
            key={screenshot.id}
            alt={`视频截图 ${index + 1}`}
            className="rounded-lg shadow-md"
            height={135}
            src={`${websiteImageURL}${screenshot.url}`}
            width={240}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoScreenshots;
