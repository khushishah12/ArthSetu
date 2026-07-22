import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";
import { neonAuthConfigured } from "@/lib/env";

const protectWithNeon = auth.middleware({
  loginUrl: "/login",
});

export async function proxy(request: NextRequest) {
  const demo = request.cookies.get("arthsetu_demo")?.value === "1";

  if (demo || !neonAuthConfigured()) {
    return NextResponse.next();
  }

  return protectWithNeon(request);
}

export const config = {
  matcher: ["/app/:path*"],
};
