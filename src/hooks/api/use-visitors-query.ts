import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { VisitorService } from "@/lib/api/services/visitor.service"

export function useVisitorsQuery() {
  return useQuery({
    queryKey: queryKeys.visitors.all,
    queryFn: VisitorService.getAllVisitors,
  })
}

