import { NextResponse } from "next/server";
import { mlBase, supabaseConfigured } from "@/lib/env";
export async function GET(){let ml="unreachable";try{const r=await fetch(`${mlBase}/api/v1/health`,{cache:"no-store",signal:AbortSignal.timeout(5000),headers:{"X-API-Key":process.env.ML_SERVICE_API_KEY||"local-development-key"}});if(r.ok)ml="connected"}catch{}return NextResponse.json({status:"ok",service:"ArthSetu AI",web:"Next.js App Router",supabase:supabaseConfigured()?"configured":"demo mode",ml,disclaimer:"Educational prototype only."})}
