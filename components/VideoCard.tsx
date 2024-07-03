import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";

interface VideoCardProps {
  video: {
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
  };
  websiteImageURL: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, websiteImageURL }) => {
  return (
    <Card key={video.id} isPressable>
      <CardBody className="p-0 relative w-full aspect-w-16 aspect-h-9 h-40 sm:h-48">
        <Link href={`/${video.attributes.aka}`}>
          <Image
            fill
            alt={video.attributes.originalname}
            className="object-cover"
            priority={true}
            quality={80}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={`${websiteImageURL}${video.attributes.poster2.url}`}
          />

          <Chip
            className="absolute bottom-2 right-2 text-tiny text-white bg-black/20 backdrop-filter backdrop-blur-md z-10"
            color="default"
            size="sm"
            variant="flat"
          >
            {video.attributes.duration}
          </Chip>
        </Link>
      </CardBody>
      <CardFooter className="justify-items-start">
        <Link href={`/${video.attributes.aka}`}>
          <p className="text-left text-xs md:text-sm font-normal line-clamp-2">
            {video.attributes.originalname}
          </p>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
