"use server";

import { getCache, setCache } from "./cache";
import { FetchOptions } from "./types/clientTypes";

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    query,
    auth,
    cacheCfg,
    ...rest
  } = options;

  if (cacheCfg) {
    const cachedData = await getCache<T>(cacheCfg.key);
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

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(`${response.status}`);
  }


  if (cacheCfg) {
    const ttl = cacheCfg?.ttl ?? 600;
    await setCache(cacheCfg.key, data, ttl);
  }

  return data;
}
