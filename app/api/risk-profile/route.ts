import { NextResponse } from "next/server";
import { runRiskProfile } from "@/lib/ml-client";
import { riskSchema } from "@/lib/validators";
export async function POST(request:Request){const parsed=riskSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({detail:parsed.error.flatten()},{status:422});return NextResponse.json(await runRiskProfile(parsed.data))}
