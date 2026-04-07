import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { VehicleService } from "@/lib/api/services/vehicle.service"

export function useVehiclesQuery() {
  return useQuery({
    queryKey: queryKeys.vehicles.all,
    queryFn: VehicleService.getAllVehicles,
  })
}

