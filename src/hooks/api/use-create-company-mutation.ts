import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { queryKeys } from "@/lib/api/query-keys"
import { CompanyService } from "@/lib/api/services/company.service"

const createCompanySchema = z.object({
  name: z.string().trim().min(1, "Le nom de l'entreprise est requis"),
})

export type CreateCompanyInput = z.infer<typeof createCompanySchema>

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateCompanyInput) => {
      const payload = createCompanySchema.parse(input)
      return CompanyService.createCompany(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
    },
  })
}
