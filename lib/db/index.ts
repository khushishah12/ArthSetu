import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  const sql = neon(databaseUrl);

  // @ts-expect-error drizzle-orm/neon-http types mismatch with @neondatabase/serverless v4
  return drizzle(sql, {
    schema,
  });
}
