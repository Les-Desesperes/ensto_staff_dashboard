import { apiClient } from "@/lib/api/client"
import { type ApiResponse, unwrapApiResponse } from "@/lib/api/types"
import { type LoginCredentials, type LoginResult } from "@/lib/auth/types"

interface LoginApiData {
  token?: string
  accessToken?: string
  tokenType?: string
  expiresInMs?: number
  user?: {
    employeeId: string | number
    username: string
    role: "Admin" | "Magasinier" | "Personnel"
    badgeUuid: string
  }
}

export const AuthService = {
  async login(payload: LoginCredentials): Promise<LoginResult> {
    const response = await apiClient.post<ApiResponse<LoginApiData>>("/auth/login", payload)
    const data = unwrapApiResponse(response.data)

    const token = data.token ?? data.accessToken
    if (!token || !data.user) {
      throw new Error("Invalid login response payload")
    }

    return {
      token,
      user: data.user,
      tokenType: data.tokenType,
      expiresInMs: data.expiresInMs,
    }
  },
}

