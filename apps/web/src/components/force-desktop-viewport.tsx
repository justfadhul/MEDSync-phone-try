"use client";

import { useEffect } from "react";

// The web build is a DESKTOP surface — mobile responsiveness is intentionally
// disabled (mobile ships as the Expo app). The `viewport` export in layout.tsx
// sets `width=1280` with no initial-scale so a phone browser scales the desktop
// layout to fit. Next re-injects its default `initial-scale=1` during client
// hydration, though, which pins it 1:1 (cropped). This component re-asserts the
// intended viewport after hydration so the scale-to-fit behaviour wins.
export function ForceDesktopViewport() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "width=1280, viewport-fit=cover");
  }, []);
  return null;
}
