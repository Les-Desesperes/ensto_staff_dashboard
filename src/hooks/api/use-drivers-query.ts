import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { DriverService } from "@/lib/api/services/driver.service"

export function useDriversQuery() {
  return useQuery({
    queryKey: queryKeys.drivers.all,
    queryFn: DriverService.getAllDrivers,
  })
}

