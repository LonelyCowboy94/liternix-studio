"use client";

import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  const pageName = lastSegment === "admin" || !lastSegment 
    ? "Overview" 
    : lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  return (
    <span className="capitalize">
      {pageName}
    </span>
  );
}