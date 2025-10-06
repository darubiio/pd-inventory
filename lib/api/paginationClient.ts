"use server";

import { getAllCacheChunks, setCacheChunks } from "./cache";
import { apiFetch } from "./client";
import { FetchOptions } from "./types/clientTypes";

const THREE_HOURS_IN_SECONDS = 3 * 60 * 60;

interface PaginatedApiOptions<T, U>
  extends Omit<FetchOptions<T, U>, "transform"> {
  extractPage: (response: U) => {
    data: T[];
    has_more: boolean;
  };
  buildPath: (page: number) => string;
  cacheKeyBase: string;
  cacheTTL?: number;
}

export async function apiFetchAllPaginated<T, U>({
  extractPage,
  buildPath,
  cacheKeyBase,
  cacheTTL = 600,
  auth,
  headers,
  body,
  method = "GET",
  ...rest
}: PaginatedApiOptions<T, U>): Promise<T[]> {
  const cachedData = await getAllCacheChunks<T>(cacheKeyBase);
  if (cachedData.length) return cachedData;

  let allData: T[] = [];
  let hasMore = true;
  let page = 1;

  try {
    while (hasMore) {
      const path = buildPath(page);
      const response = await apiFetch<U>(path, {
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

    await setCacheChunks<T>(
      cacheKeyBase,
      allData,
      THREE_HOURS_IN_SECONDS,
      cacheTTL
    );

    return allData;
  } catch (error) {
    throw error;
  }
}
