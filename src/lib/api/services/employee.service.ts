import { apiClient } from "@/lib/api/client"
import {
  type ApiResponse,
  type CreateEmployeeBody,
  type Employee,
  type UpdateEmployeeBody,
  unwrapApiResponse,
} from "@/lib/api/types"

export const EmployeeService = {
  async getAllEmployees(): Promise<Employee[]> {
    const response = await apiClient.get<ApiResponse<Employee[]>>("/employees/")
    return unwrapApiResponse(response.data)
  },

  async getEmployeeById(id: string): Promise<Employee> {
    // Requires a backend GET /employees/:id route.
    const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`)
    return unwrapApiResponse(response.data)
  },

  async createEmployee(payload: CreateEmployeeBody): Promise<Employee> {
    const response = await apiClient.post<ApiResponse<Employee>>("/employees/", payload)
    return unwrapApiResponse(response.data)
  },

  async updateEmployee(id: string, payload: UpdateEmployeeBody): Promise<Employee> {
    const response = await apiClient.patch<ApiResponse<Employee>>(`/employees/${id}`, payload)
    return unwrapApiResponse(response.data)
  },
}
