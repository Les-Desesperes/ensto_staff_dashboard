export interface CookieOptions {
  path?: string
  maxAge?: number
  expires?: Date
  sameSite?: "Lax" | "Strict" | "None"
  secure?: boolean
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${encodeURIComponent(name)}=`))

  if (!match) {
    return null
  }

  const value = match.slice(match.indexOf("=") + 1)
  return decodeURIComponent(value)
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") {
    return
  }

  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`]

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(options.maxAge)}`)
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`)
  }

  parts.push(`Path=${options.path ?? "/"}`)
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`)

  if (options.secure) {
    parts.push("Secure")
  }

  document.cookie = parts.join("; ")
}

export function deleteCookie(name: string, path = "/"): void {
  setCookie(name, "", {
    path,
    expires: new Date(0),
    maxAge: 0,
  })
}

