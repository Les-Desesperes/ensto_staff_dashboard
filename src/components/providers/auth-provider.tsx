"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { AuthService } from "@/lib/api/services/auth.service"
import { type AuthUser, type LoginCredentials } from "@/lib/auth/types"
import { authUserFromJwt } from "@/lib/auth/jwt"
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/auth/token"
import { deleteCookie, setCookie } from "@/lib/auth/cookie"
import { onAuthUnauthorized } from "@/lib/auth/auth-events"

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function isSecureContext(): boolean {
  return typeof window !== "undefined" && window.location.protocol === "https:"
}

function persistRoleCookie(role: AuthUser["role"]): void {
  setCookie("auth_role", role, {
    path: "/",
    sameSite: "Lax",
    secure: isSecureContext(),
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isBootstrapping, setIsBootstrapping] = React.useState(true)

  const logout = React.useCallback(() => {
    clearAuthToken()
    deleteCookie("auth_role")
    setUser(null)
    queryClient.clear()
    router.replace("/login")
  }, [queryClient, router])

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      const result = await AuthService.login(credentials)
      setAuthToken(result.token)
      persistRoleCookie(result.user.role)
      setUser(result.user)
      router.replace("/dashboard")
    },
    [router],
  )

  React.useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      setIsBootstrapping(false)
      return
    }

    const decoded = authUserFromJwt(token)
    setUser(decoded)
    if (decoded?.role) {
      persistRoleCookie(decoded.role)
    }
    setIsBootstrapping(false)
  }, [])

  React.useEffect(() => {
    return onAuthUnauthorized(() => {
      logout()
    })
  }, [logout])

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      logout,
    }),
    [isBootstrapping, login, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

