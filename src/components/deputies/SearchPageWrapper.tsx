'use client';

import { useSearchParams } from "next/navigation";
import { SearchPageComponent } from "./SearchPageComponent";

export function SearchPageWrapper() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return <SearchPageComponent initialQuery={initialQuery} />;
}