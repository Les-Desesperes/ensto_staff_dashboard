import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"

import { queryKeys } from "@/lib/api/query-keys"
import { EmployeeService } from "@/lib/api/services/employee.service"

const updateEmployeeSchema = z
  .object({
    username: z.string().trim().min(1).optional(),
    badgeUuid: z.string().regex(/^[A-F0-9]{8}$/).optional(),
    passwordHash: z.string().trim().min(1).optional(),
    role: z.enum(["Admin", "Magasinier", "Personnel"]).optional(),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
  })
  .refine((payload) => Object.values(payload).some((value) => value !== undefined), {
    message: "At least one field is required to update the employee",
  })

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>

export function useUpdateEmployeeMutation(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateEmployeeInput) => {
      const payload = updateEmployeeSchema.parse(input)
      return EmployeeService.updateEmployee(id, payload)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.employees.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(id) }),
      ])
    },
  })
}

