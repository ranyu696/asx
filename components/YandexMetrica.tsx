"use client";

import { YandexMetricaProvider } from "next-yandex-metrica";

type YandexMetricaProps = {
  children: React.ReactNode;
  tagID: number;
};

export default function YandexMetrica({ children, tagID }: YandexMetricaProps) {
  return (
    <YandexMetricaProvider
      initParameters={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      }}
      tagID={tagID}
    >
      {children}
    </YandexMetricaProvider>
  );
}
