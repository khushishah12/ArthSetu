import { NextResponse } from "next/server";
export async function GET(request:Request){const url=new URL(request.url);const next=url.searchParams.get("next")||"/questionnaire";const response=NextResponse.redirect(new URL(next,url.origin));response.cookies.set("arthsetu_demo","1",{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",maxAge:60*60*24*7,path:"/"});return response}
export async function DELETE(request:Request){const response=NextResponse.json({status:"cleared"});response.cookies.delete("arthsetu_demo");return response}
