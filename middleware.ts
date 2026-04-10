import { NextResponse, type NextRequest } from "next/server"

const ADMIN_ONLY_PREFIXES = ["/dashboard/users", "/dashboard/securite"]

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1]
    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=")
    const json = atob(padded)

    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

function getRole(request: NextRequest, token: string | undefined): string | null {
  const roleCookie = request.cookies.get("auth_role")?.value
  if (roleCookie) {
    return roleCookie
  }

  if (!token) {
    return null
  }

  const payload = decodeJwtPayload(token)
  const role = payload?.role

  return typeof role === "string" ? role : null
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (token && ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const role = getRole(request, token)
    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
}

