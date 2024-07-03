import React from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { Card } from "@nextui-org/card";

export const VideoPlayerSkeleton: React.FC = () => (
  <Skeleton className="w-full aspect-w-16 aspect-h-9 rounded-lg" />
);

export const VideoInfoSkeleton: React.FC = () => (
  <div className="space-y-4 mt-8">
    <Skeleton className="h-8 w-3/4 rounded-lg" />
    <div className="flex space-x-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-6 w-20 rounded-full" />
      ))}
    </div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-4 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

export const VideoScreenshotsSkeleton: React.FC = () => (
  <div className="mt-8 space-y-4">
    <Skeleton className="h-6 w-1/4 rounded-lg" />
    <div className="flex space-x-4 overflow-x-auto">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="w-40 h-24 rounded-lg flex-shrink-0" />
      ))}
    </div>
  </div>
);

export const RelatedVideosSkeleton: React.FC = () => (
  <div className="mt-8 space-y-4">
    <Skeleton className="h-6 w-1/4 rounded-lg" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i} className="w-full space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300" />
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export const RecommendedVideosSkeleton: React.FC = () => (
  <div className="lg:w-1/4 mt-8 lg:mt-0 lg:pl-8 space-y-4">
    <Skeleton className="h-6 w-1/2 rounded-lg" />
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="w-full space-y-5 p-4" radius="lg">
          <div className="flex space-x-4">
            <Skeleton className="rounded-lg w-1/3">
              <div className="h-20 rounded-lg bg-default-300" />
            </Skeleton>
            <div className="w-2/3 space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 rounded-lg bg-default-200" />
              </Skeleton>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
export const VideoGridSkeleton: React.FC = () => (
  <div className="container mx-auto">
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 h-40 w-full mb-2" />
          <div className="bg-gray-300 h-4 w-3/4 mb-2" />
          <div className="bg-gray-300 h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);
