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

  async getEmployeeById(id: string): Promise<Employee | null> {
    // Backend currently has no /employees/:id route, so we resolve from list.
    const employees = await EmployeeService.getAllEmployees()
    return employees.find((employee) => String(employee.employeeId) === id) ?? null
  },

  async createEmployee(payload: CreateEmployeeBody): Promise<Employee> {
    const response = await apiClient.post<ApiResponse<Employee>>("/employees/", payload)
    return unwrapApiResponse(response.data)
  },
}
