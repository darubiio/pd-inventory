# Redis Key Management

## Environment Prefixes

All Redis keys are automatically prefixed based on the environment to prevent development and production data from mixing in the same Redis instance.

### Automatic Prefixing

- **Development** (`NODE_ENV=development`): All keys prefixed with `DEV:`
- **Production** (any other environment): No prefix added

### Examples

| Logical Key           | Development Key           | Production Key        |
| --------------------- | ------------------------- | --------------------- |
| `Zoho-warehouses`     | `DEV:Zoho-warehouses`     | `Zoho-warehouses`     |
| `zoho_session:abc123` | `DEV:zoho_session:abc123` | `zoho_session:abc123` |
| `Zoho-oauthtoken`     | `DEV:Zoho-oauthtoken`     | `Zoho-oauthtoken`     |

## Usage

### Always Use Cache Functions

**❌ NEVER do this:**
```typescript
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();
await redis.set("my-key", value);
await redis.get("my-key");
```

**✅ ALWAYS do this:**
```typescript
import { getCache, setCache } from "./cache";

await setCache("my-key", value, 600);
const data = await getCache("my-key");
```

All cache functions automatically handle environment prefixes internally. You never need to use `getRedisKey()` outside of `cache.ts`.

### Key Management Utilities

Use npm/pnpm scripts to inspect and manage Redis keys:

```bash
# List all keys separated by environment
pnpm redis list

# Clear all development keys
pnpm redis clear-dev
```

## Implementation Files

- `lib/api/redisKeyUtils.ts` - Core prefix utilities (INTERNAL USE ONLY)
- `lib/api/cache.ts` - Cache wrapper functions (USE THESE)
  - `getCache(key)` - Get value from cache
  - `setCache(key, value, ttl)` - Set value in cache
  - `deleteCache(key)` - Delete key from cache
  - `getCacheKeys(pattern)` - Get keys matching pattern
  - `getAllCacheChunks(baseKey)` - Get chunked data
  - `setCacheChunks(baseKey, data, chunkSize, ttl)` - Store chunked data
  - `stripEnvPrefix(key)` - Remove env prefix from key
- `lib/auth/sessionStore.ts` - Session management (uses cache functions)
- `lib/auth/zohoAuth.ts` - OAuth session handling (uses cache functions)

## Adding New Cache Keys

When adding new cache operations, always use the cache functions from `cache.ts`:

```typescript
// ✅ Correct - use cache functions
import { getCache, setCache } from "../api/cache";

const data = await getCache<MyType>("my-resource");
if (!data) {
  const freshData = await fetchData();
  await setCache("my-resource", freshData, 600);
}

// ✅ For pattern matching
import { getCacheKeys, stripEnvPrefix } from "../api/cache";

const keys = await getCacheKeys("session:*");
const cleanKeys = keys.map(stripEnvPrefix);

// ❌ NEVER use Redis directly
import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();
await redis.set("key", value); // DON'T DO THIS
```

## Benefits

1. **Safe Development**: Develop without affecting production data
2. **Easy Testing**: Clear development keys without touching production
3. **Single Redis Instance**: Use one Redis instance for multiple environments
4. **Automatic**: No manual prefix management required
5. **Centralized**: All Redis operations go through cache functions
6. **Type-Safe**: TypeScript ensures correct usage
