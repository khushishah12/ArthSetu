import {
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const assessmentRuns = pgTable(
  "assessment_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    profileKey: text("profile_key").notNull(),
    score: integer("score").notNull(),
    riskBucket: text("risk_bucket").notNull(),
    confidence: real("confidence").notNull(),
    plan: text("plan"),
    monthlyAmount: integer("monthly_amount"),
    years: integer("years"),
    result: jsonb("result")
      .$type<Record<string, unknown>>()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("assessment_runs_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);

export const consentEvents = pgTable(
  "consent_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    consentType: text("consent_type").notNull(),
    status: text("status").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("consent_events_user_created_idx").on(
      table.userId,
      table.createdAt,
    ),
  ],
);
