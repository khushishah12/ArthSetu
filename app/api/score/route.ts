import { NextResponse } from "next/server";
import { runScore } from "@/lib/ml-client";
export async function POST(request:Request){try{return NextResponse.json(await runScore(await request.json()))}catch(error){return NextResponse.json({detail:error instanceof Error?error.message:"Score request failed"},{status:400})}}
