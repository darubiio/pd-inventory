const ENV_PREFIX = process.env.NODE_ENV === "development" ? "DEV:" : "";

export function getRedisKey(key: string): string {
  return `${ENV_PREFIX}${key}`;
}

export function getRedisKeyPattern(pattern: string): string {
  return `${ENV_PREFIX}${pattern}`;
}

export function stripEnvPrefix(key: string): string {
  if (ENV_PREFIX && key.startsWith(ENV_PREFIX)) {
    return key.substring(ENV_PREFIX.length);
  }
  return key;
}
