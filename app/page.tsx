import { title, subtitle } from "@/components/primitives";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import {
  fetchWebsiteData,
  fetchVideosByTag,
  fetchLatestVideos,
  fetchPopularVideos,
} from "@/config/api";
import { getStartOfWeek, getThirtyDaysAgo } from "@/config/utils";

export default async function Home() {
  try {
    const websiteData = await fetchWebsiteData();
    const websiteCategories = websiteData.attributes.categories.data.map(
      (category) => category.id,
    );

    // 并行获取所有数据
    const [nakadashiVideos, bigTitsVideos, latestVideos, popularVideos] =
      await Promise.all([
        fetchVideosByTag("中出", 4),
        fetchVideosByTag("巨乳", 4),
        fetchLatestVideos(12),
        fetchPopularVideos(getStartOfWeek(), 8, websiteCategories),
      ]);

    const websiteImageURL = websiteData.attributes.imageURL;

    // 如果最近一周没有足够的热门视频，获取最近30天的热门视频
    // 如果最近一周没有足够的热门视频，获取最近30天的热门视频
    let finalPopularVideos = popularVideos;

    if (popularVideos.length === 0) {
      finalPopularVideos = await fetchPopularVideos(
        getThirtyDaysAgo(),
        8,
        websiteCategories,
      );
    }

    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}> 在线观看</h1>
          <h2 className={subtitle({ class: "mt-4" })}>探索精彩视频</h2>
        </div>
        <div className="container mx-auto space-y-12">
          <VideoSection
            title="中出"
            videos={nakadashiVideos}
            websiteImageURL={websiteImageURL}
          />
          <VideoSection
            title="巨乳"
            videos={bigTitsVideos}
            websiteImageURL={websiteImageURL}
          />
          <VideoSection
            title="最新发布视频"
            videos={latestVideos}
            websiteImageURL={websiteImageURL}
          />
          <VideoSection
            title="最受欢迎视频"
            videos={finalPopularVideos}
            websiteImageURL={websiteImageURL}
          />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    return <div>发生错误，请稍后再试</div>;
  }
}

function VideoSection({
  title,
  videos,
  websiteImageURL,
}: {
  title: string;
  videos: Video[];
  websiteImageURL: string;
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            websiteImageURL={websiteImageURL}
          />
        ))}
      </div>
    </div>
  );
}
