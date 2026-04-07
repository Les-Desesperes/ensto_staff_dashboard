import { apiClient } from "@/lib/api/client"
import { type ApiResponse, type Vehicle, unwrapApiResponse } from "@/lib/api/types"

export const VehicleService = {
  async getAllVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get<ApiResponse<Vehicle[]>>("/vehicle/")
    return unwrapApiResponse(response.data)
  },
}

