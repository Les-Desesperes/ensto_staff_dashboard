import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/api/query-keys"
import { EmployeeService } from "@/lib/api/services/employee.service"

export function useEmployeeQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => EmployeeService.getEmployeeById(id),
    enabled: Boolean(id),
  })
}

