import { apiClient } from "@/lib/api/client"
import {
  type ApiResponse,
  type CreateHistoryLogBody,
  type HistoryLog,
  unwrapApiResponse,
} from "@/lib/api/types"

export const HistoryLogService = {
  async getAllHistoryLogs(): Promise<HistoryLog[]> {
    const response = await apiClient.get<ApiResponse<HistoryLog[]>>("/history-log/")
    return unwrapApiResponse(response.data)
  },

  async createHistoryLog(payload: CreateHistoryLogBody): Promise<HistoryLog> {
    const response = await apiClient.post<ApiResponse<HistoryLog>>("/history-log/", payload)
    return unwrapApiResponse(response.data)
  },
}

