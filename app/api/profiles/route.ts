import { NextResponse } from "next/server";
import { getProfiles } from "@/lib/ml-client";
export async function GET(){const result=await getProfiles();return NextResponse.json(result.data,{headers:{"X-ArthSetu-Mode":result.fallback?"demo-fallback":"live-ml"}})}
