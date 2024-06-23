"use client";

import React, { useCallback } from "react";
import { Button } from "@nextui-org/button";

import { HeartFilledIcon } from "@/components/icons";

/* eslint-env browser */

const BookmarkButton = () => {
  const handleBookmark = useCallback(() => {
    const url = window.location.href;
    const title = document.title;

    if (window.sidebar && window.sidebar.addPanel) {
      // For Firefox <23
      window.sidebar.addPanel(title, url, "");
    } else if ((window as any).external && "AddFavorite" in window.external) {
      // For IE Favorites
      (window as any).external.AddFavorite(url, title);
    } else {
      // For other browsers
      alert("请使用 Ctrl+D (Windows) 或 Cmd+D (Mac) 将此页面添加到书签。");
    }
  }, []);

  return (
    <Button
      className="text-sm font-normal text-default-600 bg-default-100"
      startContent={<HeartFilledIcon className="text-danger" />}
      variant="flat"
      onClick={handleBookmark}
    >
      收藏网页
    </Button>
  );
};

export default BookmarkButton;
