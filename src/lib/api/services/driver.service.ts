import { apiClient } from "@/lib/api/client"
import {
  type ApiResponse,
  type CreateDriverBody,
  type DeliveryDriver,
  unwrapApiResponse,
} from "@/lib/api/types"

export const DriverService = {
  async createDriver(payload: CreateDriverBody): Promise<DeliveryDriver> {
    const response = await apiClient.post<ApiResponse<DeliveryDriver>>("/driver/", payload)
    return unwrapApiResponse(response.data)
  },

  async getAllDrivers(): Promise<DeliveryDriver[]> {
    const response = await apiClient.get<ApiResponse<DeliveryDriver[]>>("/driver/")
    return unwrapApiResponse(response.data)
  },
}

