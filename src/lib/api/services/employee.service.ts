import { apiClient } from "@/lib/api/client"
import {
  type ApiResponse,
  type CreateEmployeeBody,
  type Employee,
  unwrapApiResponse,
} from "@/lib/api/types"

export const EmployeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<ApiResponse<Employee[]>>("/employees/")
    return unwrapApiResponse(response.data)
  },

  async createEmployee(payload: CreateEmployeeBody): Promise<Employee> {
    const response = await apiClient.post<ApiResponse<Employee>>("/employees/", payload)
    return unwrapApiResponse(response.data)
  },
}

