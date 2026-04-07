import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { queryKeys } from "@/lib/api/query-keys"
import { EmployeeService } from "@/lib/api/services/employee.service"

const createEmployeeSchema = z.object({
  username: z.string().trim().min(1),
  badgeUuid: z.string().regex(/^[A-F0-9]{8}$/),
  password: z.string().trim().min(1),
  role: z.enum(["Admin", "Magasinier", "Personnel"]),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateEmployeeInput) => {
      const payload = createEmployeeSchema.parse(input)
      return EmployeeService.createEmployee(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}
