import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import {
  databaseConfigured,
  mlBase,
  neonAuthConfigured,
} from "@/lib/env";

export async function GET() {
  let ml = "unreachable";
  let database = databaseConfigured() ? "unreachable" : "demo mode";

  try {
    const response = await fetch(`${mlBase}/api/v1/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      headers: {
        "X-API-Key":
          process.env.ML_SERVICE_API_KEY ||
          "local-development-key",
      },
    });

    if (response.ok) {
      ml = "connected";
    }
  } catch {
    ml = "unreachable";
  }

  try {
    const db = getDb();

    if (db) {
      await db.execute(sql`select 1`);
      database = "connected";
    }
  } catch {
    database = "unreachable";
  }

  return NextResponse.json({
    status: "ok",
    service: "ArthSetu AI",
    web: "Next.js App Router",
    auth: neonAuthConfigured() ? "Neon Auth configured" : "demo mode",
    database,
    ml,
    disclaimer: "Educational prototype only.",
  });
}
