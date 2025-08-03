"use server";

import { Redis } from "@upstash/redis";
const { get, set, keys } = Redis.fromEnv();

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await get<T>(key);
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
    await set(key, value, { ex: ttlSeconds });
  } catch (err) {
    console.warn("Redis SET failed:", err);
  }
}

export async function getAllCacheChunks<T>(baseKey: string): Promise<T[]> {
  const chunkKeys = await keys(`${baseKey}:chunk:*`);
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
    const chunkKey = `${baseKey}:chunk:${i / chunkSize + 1}`;

    chunkPromises.push(set(chunkKey, chunk, { ex: ttlSeconds }));
  }
  await Promise.all(chunkPromises);
}
