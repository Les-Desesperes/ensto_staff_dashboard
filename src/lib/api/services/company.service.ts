import { apiClient } from "@/lib/api/client"
import { type ApiResponse, unwrapApiResponse } from "@/lib/api/types"

export interface Company {
  companyId: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export const CompanyService = {
  async getAllCompanies(): Promise<Company[]> {
    const response = await apiClient.get<ApiResponse<Company[]>>("/company/")
    return unwrapApiResponse(response.data)
  },

  async createCompany(payload: { name: string }): Promise<Company> {
    const response = await apiClient.post<ApiResponse<Company>>("/company/", payload)
    return unwrapApiResponse(response.data)
  },
}


