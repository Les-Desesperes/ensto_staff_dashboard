import { type Employee } from "@/lib/api/types"
import { type User } from "@/lib/types"

export function employeeToUser(employee: Employee): User {
  return {
    id: String(employee.employeeId),
    username: employee.username,
    badgeUuid: employee.badgeUuid,
    firstName: employee.firstName,
    lastName: employee.lastName,
    role: employee.role,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  }
}

