import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session-config";

export const runtime = "nodejs";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isLoggedIn) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
