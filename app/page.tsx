import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/components/VideoCard";
async function fetchVideos(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();

  return data.data;
}

export default async function Home() {
  // 获取域名
  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields=imageURL",
    { next: { revalidate: 3600 } },
  );
  const dataWebsite = await resWebsite.json();
  const websiteImageURL = dataWebsite.data.attributes.imageURL;

  // 获取中出视频
  const nakadashiVideos = await fetchVideos(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[tags][name][$eq]=中出&fields[0]=originalname&fields[1]=duration&fields[2]=aka&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name&pagination[limit]=4`,
  );

  // 获取巨乳视频
  const bigTitsVideos = await fetchVideos(
    `https://strapi.xiaoxinlook.cc/api/videos?filters[tags][name][$eq]=巨乳&fields[0]=originalname&fields[1]=duration&fields[2]=aka&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name&pagination[limit]=4`,
  );

  // 获取最新视频
  const latestVideos = await fetchVideos(
    `https://strapi.xiaoxinlook.cc/api/videos?sort[0]=createdAt:desc&filters[category][id][$eq]=1&fields[0]=originalname&fields[1]=duration&fields[2]=aka&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&pagination[limit]=12`,
  );

  // 获取最受欢迎视频
  const currentDate = new Date();
  const startOfWeek = new Date(
    currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
  ).toISOString();
  const thirtyDaysAgo = new Date(
    currentDate.setDate(currentDate.getDate() - 30),
  ).toISOString();

  let popularVideos = await fetchVideos(
    `https://strapi.xiaoxinlook.cc/api/videos?sort[0]=count:desc&filters[createdAt][$gte]=${startOfWeek}&pagination[limit]=8&fields[0]=originalname&fields[1]=duration&fields[2]=aka&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name`,
  );

  if (popularVideos.length === 0) {
    popularVideos = await fetchVideos(
      `https://strapi.xiaoxinlook.cc/api/videos?sort[0]=count:desc&filters[createdAt][$gte]=${thirtyDaysAgo}&pagination[limit]=8&fields[0]=originalname&fields[1]=duration&fields[2]=aka&populate[poster2][fields][0]=url&populate[poster2][fields][1]=width&populate[poster2][fields][2]=height&populate[category][fields][0]=name`,
    );
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}> 在线观看</h1>
        <h2 className={subtitle({ class: "mt-4" })}>探索精彩视频</h2>
      </div>
      <div className="container mx-auto space-y-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">中出</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nakadashiVideos.map((video: any) => (
              <VideoCard
                key={video.id}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">巨乳</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bigTitsVideos.map((video: any) => (
              <VideoCard
                key={video.id}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">最新发布视频</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {latestVideos.map((video: any) => (
              <VideoCard
                key={video.id}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">最受欢迎视频</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularVideos.map((video: any) => (
              <VideoCard
                key={video.id}
                video={video}
                websiteImageURL={websiteImageURL}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
