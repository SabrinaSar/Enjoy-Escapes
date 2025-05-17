"use client";

import React, { useEffect, useState } from "react";
import { fetchBanners, BannerData } from "../actions/fetchBanners";
import Banner from "./Banner";

export default function BannerContainer() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      setLoading(true);
      try {
        const result = await fetchBanners();
        if (result.error) {
          throw new Error(result.error);
        }
        setBanners(result.banners);
        setError(null);
      } catch (err) {
        console.error("Failed to load banners:", err);
        setError(err instanceof Error ? err.message : "Failed to load banners.");
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  // Don't render anything if there are no banners
  if (banners.length === 0 && !loading) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-24 animate-pulse bg-muted rounded-lg"></div>
    );
  }

  if (error) {
    // Don't show error to users, just log it and return nothing
    console.error("Banner error:", error);
    return null;
  }

  return (
    <div className="space-y-6">
      {banners.map((banner) => (
        <Banner key={banner.id} banner={banner} />
      ))}
    </div>
  );
} 