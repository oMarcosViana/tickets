"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/lib/site-config";

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { config: SiteConfig }) => {
        if (isMounted) {
          setConfig(payload.config);
        }
      })
      .catch(() => {
        if (isMounted) {
          setConfig(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return config;
}

export function useGamePriceMap() {
  const config = useSiteConfig();

  return new Map(
    config?.games.map((game) => [game.id, game.priceUsd]) ?? [],
  );
}
