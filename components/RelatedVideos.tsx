import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";

import { Video } from "@/types";

interface RelatedVideosProps {
  videos: Video[];
  websiteImageURL: string;
}

const RelatedVideos: React.FC<RelatedVideosProps> = ({
  videos,
  websiteImageURL,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">相关视频</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {videos.map((video) => (
          <Card key={video.id} isPressable className="max-w-[300px] group">
            <Link href={`/${video.attributes.aka}`}>
              <CardBody className="p-0 aspect-w-16 aspect-h-9">
                <Image
                  removeWrapper
                  alt={video.attributes.originalname}
                  className="z-0 w-full h-auto object-cover"
                  src={`${websiteImageURL}${video.attributes.poster2.url}`}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
                  <div>
                    <p className="text-white text-xs">
                      {video.attributes.duration}
                    </p>
                    <h4 className="text-white font-medium text-sm line-clamp-2 mt-1">
                      {video.attributes.originalname}
                    </h4>
                  </div>
                  <span className="text-white text-xs hover:underline">
                    查看详情
                  </span>
                </div>
              </CardBody>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
