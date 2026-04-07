"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

import { clearAuthToken } from "@/lib/auth/token"
import { onAuthUnauthorized } from "@/lib/auth/auth-events"

export function AuthEventListener() {
  const router = useRouter()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    return onAuthUnauthorized(() => {
      clearAuthToken()
      queryClient.clear()

      if (window.location.pathname !== "/login") {
        router.replace("/login")
      }
    })
  }, [queryClient, router])

  return null
}

