import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface-primary border border-line-subtle rounded-md p-6 shadow-sm flex flex-col",
        className,
      )}
      {...props}
    />
  );
}
