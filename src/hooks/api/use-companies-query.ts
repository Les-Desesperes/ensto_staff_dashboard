import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { CompanyService } from "@/lib/api/services/company.service"

export function useCompaniesQuery() {
  return useQuery({
    queryKey: queryKeys.companies.all,
    queryFn: CompanyService.getAllCompanies,
  })
}

