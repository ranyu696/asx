"use client";

import React, { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import AnnouncementModal from "@/components/AnnouncementModal";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const isClient = typeof window !== "undefined";
      if (!isClient) return;

      const storage = isClient ? window.localStorage : null;
      const lastShown = storage?.getItem("announcementLastShown");
      const today = new Date().toDateString();

      if (lastShown !== today) {
        try {
          const res = await fetch("/api/announcement");
          const data = await res.json();

          setAnnouncement(data.announcement);
          setIsOpen(true);
          storage?.setItem("announcementLastShown", today);
        } catch (error) {
          // Error logging removed to comply with no-console rule
        }
      }
    };

    fetchAnnouncement();
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {children}
        <AnnouncementModal
          announcement={announcement}
          isOpen={isOpen}
          onClose={handleClose}
        />
      </NextThemesProvider>
    </NextUIProvider>
  );
}