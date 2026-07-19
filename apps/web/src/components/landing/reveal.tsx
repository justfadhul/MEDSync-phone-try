"use client";

import { useEffect, useRef, useState } from "react";

// Reveals children on scroll (fade-and-rise). The motion itself lives in CSS,
// gated behind `prefers-reduced-motion: no-preference` (see globals.css), so
// reduce-motion users get the content immediately with no animation. If
// IntersectionObserver is unavailable, content shows straight away.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
