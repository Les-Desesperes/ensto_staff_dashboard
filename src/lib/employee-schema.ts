import { z } from "zod"

export const employeeSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.enum(["Admin", "WarehouseWorker"]),
  status: z.enum(["Actif", "Suspendu"]),
  lastLogin: z.string(),
  securityIssue: z.boolean(),
})

export type Employee = z.infer<typeof employeeSchema>

