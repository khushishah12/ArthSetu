import { NextResponse } from "next/server";
import { getModelCard } from "@/lib/ml-client";
export async function GET(){try{return NextResponse.json(await getModelCard())}catch{return NextResponse.json({model:"StandardScaler + LogisticRegression",training_data:"6,000 synthetic profiles",features:13,status:"fallback metadata",disclaimer:"Educational prototype only."})}}
