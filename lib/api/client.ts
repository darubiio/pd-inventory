"use server";

import { getCache, setCache } from "./cache";
import { FetchOptions } from "./types/clientTypes";

export async function apiFetch<FinalResponse, ApiResponse = unknown>(
  path: string,
  options: FetchOptions<FinalResponse, ApiResponse> = {}
): Promise<FinalResponse> {
  const {
    method = "GET",
    headers = {},
    body,
    auth,
    cacheCfg,
    transform,
    ...rest
  } = options;

  if (cacheCfg) {
    const cachedData = await getCache<FinalResponse>(cacheCfg.key);
    if (cachedData) return cachedData;
  }

  const apiHeaders: Record<string, string> = { ...headers };

  if (auth) {
    const token = await auth.getToken();
    if (token) apiHeaders.Authorization = `${auth.header} ${token}`;
  }

  const response = await fetch(path, {
    body,
    method,
    headers: apiHeaders,
    ...rest,
  });

  const data: ApiResponse = await response.json();
  const transformedData = transform ? transform(data) : data;

  if (response.status !== 200) {
    throw new Error(`${response.status}`);
  }

  if (cacheCfg) {
    const ttl = cacheCfg?.ttl ?? 600;
    await setCache(cacheCfg.key, transformedData, ttl);
  }

  return transformedData as FinalResponse;
}
