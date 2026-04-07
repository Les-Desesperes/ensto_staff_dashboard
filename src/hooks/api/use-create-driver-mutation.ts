import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { queryKeys } from "@/lib/api/query-keys"
import { DriverService } from "@/lib/api/services/driver.service"

const createDriverSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  companyId: z.string().trim().min(1, "Company id is required"),
  ppeCharterValid: z.boolean().optional(),
  ppeSignatureDate: z.string().datetime().optional(),
})

export type CreateDriverInput = z.infer<typeof createDriverSchema>

export function useCreateDriverMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateDriverInput) => {
      const payload = createDriverSchema.parse(input)
      return DriverService.createDriver(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all })
    },
  })
}

