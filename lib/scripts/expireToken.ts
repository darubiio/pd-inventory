import { config } from "dotenv";
import { Redis } from "@upstash/redis";
import { UserSession } from "../../types/zoho";

config({ path: ".env.local" });

const redis = Redis.fromEnv();

const ENV_PREFIX = process.env.NODE_ENV === "development" ? "DEV:" : "";

async function getRedisKey(key: string): Promise<string> {
  return `${ENV_PREFIX}${key}`;
}

async function listSessions() {
  const pattern = await getRedisKey("zoho_session:*");
  const keys = await redis.keys(pattern);

  console.log("\n📋 Sesiones activas:");
  console.log("━".repeat(80));

  if (keys.length === 0) {
    console.log("❌ No hay sesiones activas");
    return;
  }

  for (const key of keys) {
    const session = await redis.get(key);
    if (session && typeof session === "object") {
      const s = session as UserSession;
      const expiresIn = Math.floor((s.expires_at - Date.now()) / 1000);
      const expiresInMin = Math.floor(expiresIn / 60);

      const cleanKey = key.replace(ENV_PREFIX, "");
      const sessionId = cleanKey.replace("zoho_session:", "");

      console.log(`\n🔑 Session ID: ${sessionId.substring(0, 30)}...`);
      console.log(`   Usuario: ${s.user.name} (${s.user.email})`);
      console.log(
        `   Expira en: ${expiresInMin} minutos (${expiresIn} segundos)`
      );
      console.log(`   Refreshes: ${s.refresh_count || 0}`);

      if (expiresIn < 0) {
        console.log(`   ❌ EXPIRADO`);
      } else if (expiresIn < 300) {
        console.log(`   ⚠️  NECESITA REFRESH (< 5 min)`);
      } else {
        console.log(`   ✅ Válido`);
      }
    }
  }
  console.log("\n" + "━".repeat(80));
}

async function expireToken(sessionIdPrefix?: string) {
  const pattern = await getRedisKey("zoho_session:*");
  const keys = await redis.keys(pattern);

  if (keys.length === 0) {
    console.log("❌ No hay sesiones activas");
    return;
  }

  let targetKey: string | null = null;

  if (sessionIdPrefix) {
    targetKey = keys.find((key) => key.includes(sessionIdPrefix)) || null;

    if (!targetKey) {
      console.log(
        `❌ No se encontró sesión con ID que contenga: ${sessionIdPrefix}`
      );
      return;
    }
  } else {
    targetKey = keys[0];
  }

  const session = await redis.get(targetKey);
  if (!session || typeof session !== "object") {
    console.log("❌ Sesión inválida");
    return;
  }

  const s = session as UserSession;
  const cleanKey = targetKey.replace(ENV_PREFIX, "");
  const sessionId = cleanKey.replace("zoho_session:", "");

  console.log("\n🔄 Expirando token...");
  console.log(`   Session ID: ${sessionId.substring(0, 30)}...`);
  console.log(`   Usuario: ${s.user.name}`);

  const expiredSession = {
    ...s,
    expires_at: Date.now() - 1000,
  };

  await redis.set(targetKey, expiredSession);

  console.log("✅ Token expirado exitosamente");
  console.log("   El próximo request disparará el refresh automático\n");
}

async function expireSoon(sessionIdPrefix?: string, minutes: number = 4) {
  const pattern = await getRedisKey("zoho_session:*");
  const keys = await redis.keys(pattern);

  if (keys.length === 0) {
    console.log("❌ No hay sesiones activas");
    return;
  }

  let targetKey: string | null = null;

  if (sessionIdPrefix) {
    targetKey = keys.find((key) => key.includes(sessionIdPrefix)) || null;

    if (!targetKey) {
      console.log(
        `❌ No se encontró sesión con ID que contenga: ${sessionIdPrefix}`
      );
      return;
    }
  } else {
    targetKey = keys[0];
  }

  const session = await redis.get(targetKey);
  if (!session || typeof session !== "object") {
    console.log("❌ Sesión inválida");
    return;
  }

  const s = session as UserSession;
  const cleanKey = targetKey.replace(ENV_PREFIX, "");
  const sessionId = cleanKey.replace("zoho_session:", "");

  console.log("\n⏰ Configurando token para expirar pronto...");
  console.log(`   Session ID: ${sessionId.substring(0, 30)}...`);
  console.log(`   Usuario: ${s.user.name}`);
  console.log(`   Expirará en: ${minutes} minutos`);

  const soonSession = {
    ...s,
    expires_at: Date.now() + minutes * 60 * 1000,
  };

  await redis.set(targetKey, soonSession);

  console.log("✅ Token configurado para expirar en", minutes, "minutos");
  console.log("   El refresh preventivo debería activarse automáticamente\n");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("\n🔐 Utilidad de manipulación de tokens OAuth\n");

  try {
    switch (command) {
      case "list":
        await listSessions();
        break;

      case "expire":
        await expireToken(args[1]);
        break;

      case "expire-soon":
        const minutes = args[1] ? parseInt(args[1]) : 4;
        await expireSoon(args[2], minutes);
        break;

      default:
        console.log("Comandos disponibles:");
        console.log("━".repeat(80));
        console.log("  pnpm session list");
        console.log("    Lista todas las sesiones activas con su estado");
        console.log("");
        console.log("  pnpm session expire [sessionId]");
        console.log("    Expira el token inmediatamente");
        console.log(
          "    Si no se proporciona sessionId, expira la primera sesión"
        );
        console.log("");
        console.log("  pnpm session expire-soon [minutos] [sessionId]");
        console.log(
          "    Configura el token para expirar en X minutos (default: 4)"
        );
        console.log("    Útil para probar el refresh preventivo");
        console.log("");
        console.log("Ejemplos:");
        console.log("  pnpm session list");
        console.log("  pnpm session expire");
        console.log("  pnpm session expire sess_1234");
        console.log("  pnpm session expire-soon 3");
        console.log("  pnpm session expire-soon 2 sess_1234");
        console.log("━".repeat(80));
        console.log("");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
