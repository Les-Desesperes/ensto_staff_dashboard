import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { EmployeeService } from "@/lib/api/services/employee.service"

export function useEmployeesQuery() {
  return useQuery({
    queryKey: queryKeys.employees.all,
    queryFn: EmployeeService.getAllEmployees,
  })
}

