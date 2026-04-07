const AUTH_TOKEN_STORAGE_KEY = "ensto_auth_token"

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  const fromStorage = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (fromStorage) {
    return fromStorage
  }

  return getCookieValue("auth_token")
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

