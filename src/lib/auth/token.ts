import { deleteCookie, getCookie, setCookie } from "@/lib/auth/cookie"

const AUTH_COOKIE_NAME = "auth_token"
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function isSecureContext(): boolean {
  return typeof window !== "undefined" && window.location.protocol === "https:"
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return getCookie(AUTH_COOKIE_NAME)
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return
  }

  setCookie(AUTH_COOKIE_NAME, token, {
    path: "/",
    sameSite: "Lax",
    secure: isSecureContext(),
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  })
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return
  }

  deleteCookie(AUTH_COOKIE_NAME)
}
