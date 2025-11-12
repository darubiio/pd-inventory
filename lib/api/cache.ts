"use server";

import { Redis } from "@upstash/redis";
import { getRedisKey, stripEnvPrefix as stripPrefix } from "./redisKeyUtils";

const { get, set, keys, del } = Redis.fromEnv();

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redisKey = getRedisKey(key);
    return await get<T>(redisKey);
  } catch (err) {
    console.warn("Redis GET failed:", err);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds = 300
): Promise<void> {
  try {
    const redisKey = getRedisKey(key);
    await set(redisKey, value, { ex: ttlSeconds });
  } catch (err) {
    console.warn("Redis SET failed:", err);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const redisKey = getRedisKey(key);
    await del(redisKey);
  } catch (err) {
    console.warn("Redis DELETE failed:", err);
  }
}

export async function getAllCacheChunks<T>(baseKey: string): Promise<T[]> {
  const redisPattern = getRedisKey(`${baseKey}:chunk:*`);
  const chunkKeys = await keys(redisPattern);
  if (!chunkKeys || chunkKeys.length === 0) return [];

  const chunkPromises = chunkKeys.map((key) => get<T[]>(key));
  const chunks = await Promise.all(chunkPromises);

  return chunks.flat().filter((item): item is T => item !== null);
}

export async function setCacheChunks<T>(
  baseKey: string,
  data: T[],
  chunkSize: number = 900,
  ttlSeconds = 2400
): Promise<void> {
  const chunkPromises = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkKey = getRedisKey(`${baseKey}:chunk:${i / chunkSize + 1}`);

    chunkPromises.push(set(chunkKey, chunk, { ex: ttlSeconds }));
  }
  await Promise.all(chunkPromises);
}

export async function getCacheKeys(pattern: string): Promise<string[]> {
  try {
    const redisPattern = getRedisKey(pattern);
    return (await keys(redisPattern)) || [];
  } catch (err) {
    console.warn("Redis KEYS failed:", err);
    return [];
  }
}

export async function stripEnvPrefix(key: string): Promise<string> {
  return stripPrefix(key);
}
