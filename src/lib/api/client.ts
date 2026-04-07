import axios, { AxiosError } from "axios"
import { clearAuthToken, getAuthToken } from "@/lib/auth/token"
import { emitAuthUnauthorized } from "@/lib/auth/auth-events"
import { ApiResponseError } from "@/lib/api/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data as { success?: boolean; message?: string }

    if (typeof payload?.success === "boolean" && !payload.success) {
      throw new ApiResponseError(payload.message || "API request failed")
    }

    return response
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status

    if (status === 401) {
      clearAuthToken()
      emitAuthUnauthorized()
    }

    if (status && status >= 500 && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("api:server-error", {
          detail: {
            status,
            message: error.response?.data?.message || "Internal Server Error",
          },
        }),
      )
    }

    return Promise.reject(error)
  },
)
