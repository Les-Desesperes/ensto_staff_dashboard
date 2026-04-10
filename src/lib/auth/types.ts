export type AuthRole = "Admin" | "Magasinier" | "Personnel"

export interface AuthUser {
  employeeId: string | number
  username: string
  role: AuthRole
  badgeUuid: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  user: AuthUser
  tokenType?: string
  expiresInMs?: number
}

