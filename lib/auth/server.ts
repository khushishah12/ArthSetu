import { createNeonAuth } from "@neondatabase/auth/next/server";

const demoSecret =
  "arthsetu-demo-cookie-secret-not-for-production-2026";

export const auth = createNeonAuth({
  baseUrl:
    process.env.NEON_AUTH_BASE_URL ||
    "http://127.0.0.1:9999/neon-auth-not-configured",
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || demoSecret,
  },
});
