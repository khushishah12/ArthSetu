export function neonAuthConfigured() {
  return Boolean(
    process.env.NEON_AUTH_BASE_URL &&
      process.env.NEON_AUTH_COOKIE_SECRET &&
      process.env.NEON_AUTH_COOKIE_SECRET.length >= 32,
  );
}

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export const allowDemoFallback =
  process.env.ALLOW_DEMO_FALLBACK !== "false";

export const mlBase = (
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");
