import { type AuthRole, type AuthUser } from "@/lib/auth/types"

interface JwtLikePayload {
  employeeId?: string | number
  userId?: string | number
  sub?: string | number
  username?: string
  role?: AuthRole
  badgeUuid?: string
  badgeUUID?: string
  exp?: number
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=")
  return atob(padded)
}

export function decodeJwtPayload(token: string): JwtLikePayload | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) {
      return null
    }

    const rawPayload = decodeBase64Url(parts[1])
    return JSON.parse(rawPayload) as JwtLikePayload
  } catch {
    return null
  }
}

export function authUserFromJwt(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token)

  if (!payload?.username || !payload?.role) {
    return null
  }

  return {
    employeeId: payload.employeeId ?? payload.userId ?? payload.sub ?? payload.username,
    username: payload.username,
    role: payload.role,
    badgeUuid: payload.badgeUuid ?? payload.badgeUUID ?? "",
  }
}

