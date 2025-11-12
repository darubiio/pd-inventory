import { config } from "dotenv";
import { Redis } from "@upstash/redis";

config({ path: ".env.local" });

const redis = Redis.fromEnv();

async function listAllKeys() {
  const allKeys = await redis.keys("*");
  console.log("\n📋 All Redis Keys:");
  console.log("==================");

  const devKeys = allKeys.filter((k) => k.startsWith("DEV:"));
  const prodKeys = allKeys.filter((k) => !k.startsWith("DEV:"));

  console.log(`\n🔧 Development Keys (${devKeys.length}):`);
  devKeys.forEach((key) => console.log(`  - ${key}`));

  console.log(`\n🚀 Production Keys (${prodKeys.length}):`);
  prodKeys.forEach((key) => console.log(`  - ${key}`));

  console.log("\n==================\n");
}

async function clearDevKeys() {
  const devKeys = (await redis.keys("DEV:*")) || [];
  console.log(`\n🗑️  Deleting ${devKeys.length} development keys...`);

  if (devKeys.length > 0) {
    await redis.del(...devKeys);
    console.log("✅ Development keys cleared!");
  } else {
    console.log("ℹ️  No development keys found.");
  }
}

const command = process.argv[2];

(async () => {
  switch (command) {
    case "list":
      await listAllKeys();
      break;
    case "clear-dev":
      await clearDevKeys();
      break;
    default:
      console.log(`
Redis Key Management Utilities
==============================

Usage:
  pnpm redis <command>

Commands:
  list       - List all Redis keys (separated by environment)
  clear-dev  - Delete all development keys (DEV: prefix)

Examples:
  pnpm redis list
  pnpm redis clear-dev
      `);
  }
})();
