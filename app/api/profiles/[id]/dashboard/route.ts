import { NextResponse } from "next/server";
import { getBundle } from "@/lib/ml-client";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){const{id}=await params;const url=new URL(request.url);const monthly=Math.max(500,Math.min(5000,Number(url.searchParams.get("monthly_amount")||2000)));const years=Math.max(1,Math.min(5,Number(url.searchParams.get("years")||3)));const result=await getBundle(id,monthly,years);return NextResponse.json(result.data,{headers:{"X-ArthSetu-Mode":result.fallback?"demo-fallback":"live-ml"}})}
