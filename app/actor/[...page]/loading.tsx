import React from "react";
import { Skeleton } from "@nextui-org/skeleton";

import { title, subtitle } from "@/components/primitives";

export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>
          <Skeleton className="w-48 h-8" />
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          <Skeleton className="w-64 h-6" />
        </h2>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {[...Array(20)].map((_, i) => (
            <Skeleton key={i} className="w-full h-48 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="w-64 h-10" />
      </div>
    </section>
  );
}
