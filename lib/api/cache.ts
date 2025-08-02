"use server";

import { Redis } from "@upstash/redis";
const { get, set } = Redis.fromEnv();

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
