"use client";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  MediaProvider,
  isHLSProvider,
  type MediaProviderAdapter,
} from "@vidstack/react";
import { Gesture } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { Poster } from "@vidstack/react";

type VideoPlayerProps = {
  videoURL: string;
  title: string;
  videoPoster: string;
  videoId: string; // 添加 videoId 以便识别视频
};

export default function VideoPlayer({
  videoURL,
  title,
  videoPoster,
  videoId,
}: VideoPlayerProps) {
  function onProviderChange(provider: MediaProviderAdapter | null) {
    if (isHLSProvider(provider)) {
      // Default development URL.
      provider.library =
        "https://cdn.bootcdn.net/ajax/libs/hls.js/1.5.11/hls.js";
      // Default production URL.
      provider.library =
        "https://cdn.bootcdn.net/ajax/libs/hls.js/1.5.11/hls.min.js";
    }
  }

  async function incrementPlayCount(videoId: string) {
    const apiUrl = `/api/videos?id=${videoId}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // 改为POST请求
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update play count');
      }

      const result = await response.json();
      console.log('Play count updated:', result);
    } catch (error) {
      console.error('Error updating play count:', error);
    }
  }

  function handlePlay() {
    incrementPlayCount(videoId);
  }

  return (
    <MediaPlayer
      playsInline
      aspectRatio="16/9"
      src={videoURL}
      title={title}
      onProviderChange={onProviderChange}
      onPlay={handlePlay} // 监听 onPlay 事件
    >
      <MediaProvider>
        <Poster
          alt={title + "视频海报"}
          className="vds-poster"
          src={videoPoster}
        />
      </MediaProvider>
      <Gesture
        action="toggle:controls"
        className="vds-gesture"
        event="pointerup"
      />
      <Gesture action="seek:-10" className="vds-gesture" event="dblpointerup" />
      <Gesture action="seek:10" className="vds-gesture" event="dblpointerup" />
      <Gesture
        action="toggle:fullscreen"
        className="vds-gesture"
        event="dblpointerup"
      />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}