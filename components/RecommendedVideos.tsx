import React from "react";
import { headers } from "next/headers";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";

import { Video } from "@/types";

interface RecommendedVideosProps {
  videos: Video[];
  websiteImageURL: string;
}

const CustomVideoCard: React.FC<{ video: Video; websiteImageURL: string }> = ({
  video,
  websiteImageURL,
}) => (
  <Card isPressable className="w-full">
    <CardBody className="p-0 aspect-w-16 aspect-h-9">
      <Image
        alt={video.attributes.originalname}
        className="object-cover w-full"
        src={`${websiteImageURL}${video.attributes.poster2.url}`}
      />
    </CardBody>
    <CardFooter className="flex-col items-start">
      <h3 className="text-sm font-medium line-clamp-2">
        {video.attributes.originalname}
      </h3>
      <p className="text-xs text-gray-300 mt-1">{video.attributes.duration}</p>
    </CardFooter>
  </Card>
);

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({
  videos,
  websiteImageURL,
}) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  // 简单的设备检测逻辑，可以根据需要调整
  const isLargeScreen =
    userAgent && !userAgent.toLowerCase().includes("mobile");

  if (!isLargeScreen) {
    return null; // 如果不是大屏设备，不渲染组件
  }

  return (
    <div className="lg:w-1/4 lg:pl-8 mt-8 lg:mt-0">
      <h2 className="text-xl font-bold mb-4">推荐视频</h2>
      <div className="space-y-4">
        {videos.map((video: Video) => (
          <Link
            key={video.id}
            className="block"
            href={`/${video.attributes.aka}`}
          >
            <CustomVideoCard video={video} websiteImageURL={websiteImageURL} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedVideos;
