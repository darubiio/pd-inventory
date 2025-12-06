"use server";

import { getCache, setCache } from "./cache";
import { FetchOptions } from "./types/clientTypes";

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

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

  if (auth && auth.getToken) {
    const token = await auth.getToken();
    if (token) apiHeaders.Authorization = `${auth.header} ${token}`;
  } else if (auth && auth.accessToken) {
    apiHeaders.Authorization = `${auth.header} ${auth.accessToken}`;
  }

  const response = await fetch(path, {
    body,
    method,
    headers: apiHeaders,
    ...rest,
  });

  if (response.status === 401) {
    console.error("❌ Unauthorized: Token is invalid or expired");
    throw new AuthenticationError("Invalid or expired authentication token");
  }

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`❌ API Error ${response.status}:`, errorBody);
    try {
      const errorJson = JSON.parse(errorBody);
      const errorMessage = errorJson.message || errorJson.error || errorBody;
      throw new Error(`${response.status}: ${errorMessage}`);
    } catch {
      throw new Error(`${response.status}: ${errorBody}`);
    }
  }

  const data: ApiResponse = await response.json();
  const transformedData = transform ? transform(data) : data;

  if (cacheCfg) {
    const ttl = cacheCfg?.ttl ?? 600;
    await setCache(cacheCfg.key, transformedData, ttl);
  }

  return transformedData as FinalResponse;
}

export { AuthenticationError };
