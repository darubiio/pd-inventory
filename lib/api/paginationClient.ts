// lib/api/paginatedApiFetch.ts
"use server";

import { getAllCacheChunks, setCacheChunks } from "./cache";
import { apiFetch } from "./client";
import { FetchOptions } from "./types/clientTypes";

interface PaginatedApiOptions<T> extends Omit<FetchOptions, "transform"> {
  extractPage: (response: any) => {
    data: T[];
    has_more: boolean;
  };
  buildPath: (page: number) => string;
  cacheKeyBase: string;
  cacheTTL?: number;
}

export async function apiFetchAllPaginated<T>({
  extractPage,
  buildPath,
  cacheKeyBase,
  cacheTTL = 600,
  auth,
  headers,
  body,
  method = "GET",
  ...rest
}: PaginatedApiOptions<T>): Promise<T[]> {
  let allData: T[] = [];
  let hasMore = true;
  let page = 1;

  const cachedData = await getAllCacheChunks<T>(cacheKeyBase);
  if (cachedData.length) return cachedData;

  while (hasMore) {
    const path = buildPath(page);
    const response = await apiFetch<T>(path, {
      method,
      headers,
      body,
      auth,
      ...rest,
    });

    const { data, has_more } = extractPage(response);

    allData = allData.concat(data);
    hasMore = has_more;
    page++;
  }

  setCacheChunks<T>(cacheKeyBase, allData, 900, cacheTTL);

  return allData;
}
