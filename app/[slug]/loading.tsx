import React from "react";

import {
  VideoPlayerSkeleton,
  VideoInfoSkeleton,
  VideoScreenshotsSkeleton,
  RelatedVideosSkeleton,
  RecommendedVideosSkeleton,
} from "@/components/Skeleton";

export default function Loading() {
  return (
    <section className="lg:flex">
      <div className="lg:w-3/4">
        <VideoPlayerSkeleton />
        <VideoInfoSkeleton />
        <VideoScreenshotsSkeleton />
        <RelatedVideosSkeleton />
      </div>
      <RecommendedVideosSkeleton />
    </section>
  );
}
