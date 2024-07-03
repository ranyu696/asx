import { Skeleton } from "@nextui-org/skeleton";
import { Card } from "@nextui-org/card";

export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <Skeleton className="h-12 w-64 rounded-lg mb-4" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>
      <div className="container mx-auto space-y-12">
        {[...Array(4)].map((_, index) => (
          <div key={index}>
            <Skeleton className="h-8 w-32 rounded-lg mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, videoIndex) => (
                <Card
                  key={videoIndex}
                  className="w-full space-y-5 p-4"
                  radius="lg"
                >
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
                    <Skeleton className="w-2/5 rounded-lg">
                      <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                    </Skeleton>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
