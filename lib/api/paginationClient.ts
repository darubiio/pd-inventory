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
  ttl?: number;
}

export async function apiFetchAllPaginated<T, U>({
  extractPage,
  buildPath,
  cacheKeyBase,
  cacheTTL = 600,
  ttl,
  auth,
  headers,
  body,
  method = "GET",
  ...rest
}: PaginatedApiOptions<T, U>): Promise<T[]> {
  const shouldCache = ttl !== 0;

  if (shouldCache) {
    const cachedData = await getAllCacheChunks<T>(cacheKeyBase);
    if (cachedData.length) return cachedData;
  }

  let resolvedAuth = auth;
  if (auth && auth.getToken) {
    const token = await auth.getToken();
    resolvedAuth = {
      header: auth.header,
      accessToken: token || "",
    };
  }

  const allData: T[] = [];
  let hasMore = true;
  let currentPage = 1;
  const BATCH_SIZE = 20;

  try {
    while (hasMore) {
      const batchPromises: Promise<{
        data: T[];
        has_more: boolean;
        page: number;
        error?: Error;
      }>[] = [];

      for (let i = 0; i < BATCH_SIZE; i++) {
        const page = currentPage + i;
        const path = buildPath(page);

        batchPromises.push(
          apiFetch<U>(path, {
            method,
            headers,
            body,
            auth: resolvedAuth,
            ...rest,
          })
            .then((response) => {
              const { data, has_more } = extractPage(response);
              return { data, has_more, page };
            })
            .catch((error) => {
              return {
                data: [],
                has_more: false,
                page,
                error: error as Error,
              };
            })
        );
      }

      const results = await Promise.all(batchPromises);

      for (const result of results) {
        if (result.error) {
          if (result.page === currentPage) {
            throw result.error;
          }
          hasMore = false;
          break;
        }

        if (result.data.length > 0) {
          allData.push(...result.data);
        }

        if (!result.has_more) {
          hasMore = false;
          break;
        }
      }

      currentPage += BATCH_SIZE;
    }

    if (shouldCache) {
      await setCacheChunks<T>(
        cacheKeyBase,
        allData,
        THREE_HOURS_IN_SECONDS,
        cacheTTL
      );
    }

    return allData;
  } catch (error) {
    throw error;
  }
}
