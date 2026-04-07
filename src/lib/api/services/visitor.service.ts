import { apiClient } from "@/lib/api/client"
import {
  type ApiResponse,
  type CreateVisitorBody,
  type Visitor,
  unwrapApiResponse,
} from "@/lib/api/types"

export const VisitorService = {
  async getAllVisitors(): Promise<Visitor[]> {
    const response = await apiClient.get<ApiResponse<Visitor[]>>("/visitor/")
    return unwrapApiResponse(response.data)
  },

  async createVisitor(payload: CreateVisitorBody): Promise<Visitor> {
    const response = await apiClient.post<ApiResponse<Visitor>>("/visitor/", payload)
    return unwrapApiResponse(response.data)
  },
}

