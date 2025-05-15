import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import { isAuth, isPublic } from "./lib/pathUtils";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);
  const {
    url,
    nextUrl: { pathname, search },
  } = request;

  if (isAuth(pathname) || isPublic(pathname)) return authRes;

  const session = await auth0.getSession();

  if (!session) {
    const { origin } = new URL(url);
    const returnTo = encodeURIComponent(pathname + search);
    return NextResponse.redirect(`${origin}/auth/login?returnTo=${returnTo}`);
  }

  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp).*)",
  ],
};
