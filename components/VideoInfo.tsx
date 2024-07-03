import React from "react";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import {
  BiAlarm,
  BiLogoVisualStudio,
  BiSolidBookmark,
  BiSolidCalendar,
  BiSolidCategory,
} from "react-icons/bi";
import { MdRecentActors } from "react-icons/md";
import { FaTags, FaUserTie } from "react-icons/fa";

import VideoSummary from "./VideoSummary";

interface VideoInfoProps {
  video: any; // Consider creating a more specific type for your video object
}

const VideoInfo: React.FC<VideoInfoProps> = ({ video }) => {
  return (
    <div className="mt-8">
      <h1 className="text-xl md:text-3xl font-bold mb-4">
        {video.attributes.originalname}
      </h1>

      <div className="flex flex-wrap items-center space-x-2 mb-4">
        <Chip radius="sm" startContent={<BiSolidCalendar size={18} />}>
          {video.attributes.year}
        </Chip>
        <Chip radius="sm" startContent={<BiAlarm size={18} />}>
          {video.attributes.duration}
        </Chip>
        <Chip radius="sm" startContent={<BiSolidBookmark size={18} />}>
          {video.attributes.aka}
        </Chip>
        <Chip radius="sm" startContent={<BiSolidCategory size={18} />}>
          {video.attributes.category.data.attributes.name}
        </Chip>
      </div>

      <InfoSection
        icon={<BiLogoVisualStudio size={18} />}
        link={`/studio/${video.attributes.studio}`}
        title="片商"
        value={video.attributes.studio}
      />
      <InfoSection
        icon={<FaUserTie size={18} />}
        link={`/director/${video.attributes.director}`}
        title="导演"
        value={video.attributes.director}
      />

      <div className="mt-4 flex flex-wrap items-center">
        <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center mr-2">
          <MdRecentActors className="mr-1" size={18} />
          演员:
        </span>
        {video.attributes.actors.data.map((actor: any) => (
          <Link
            key={actor.id}
            showAnchorIcon
            color="primary"
            href={`/actor/${actor.attributes.name}`}
          >
            {actor.attributes.name}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center">
        <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center mr-2">
          <FaTags className="mr-1" size={18} />
          标签:
        </span>
        {video.attributes.tags.data.map((tag: any) => (
          <Link
            key={tag.id}
            showAnchorIcon
            color="primary"
            href={`/tag/${tag.attributes.name}`}
          >
            {tag.attributes.name}
          </Link>
        ))}
      </div>

      <VideoSummary Summary={video.attributes.summary} />
    </div>
  );
};

const InfoSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  link: string;
}> = ({ icon, title, value, link }) => (
  <div className="mt-4 flex items-center">
    <span className="text-gray-800 dark:text-gray-300 font-bold flex items-center mr-2">
      {icon}
      {title}:
    </span>
    <Link showAnchorIcon color="primary" href={link}>
      {value}
    </Link>
  </div>
);

export default VideoInfo;
