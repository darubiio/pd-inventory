export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface AuthConfig {
  header?: string;
  getToken: () => Promise<string | null>;
}

export interface RedisConfig {
  key: string;
  ttl?: number;
}

export interface FetchOptions<T, U> extends RequestInit {
  method?: HttpMethod;
  body?: BodyInit | null;
  query?: Record<string, string | number | boolean>;
  auth?: AuthConfig;
  headers?: Record<string, string>;
  cacheCfg?: RedisConfig;
  transform?: (data: U) => T;
}
