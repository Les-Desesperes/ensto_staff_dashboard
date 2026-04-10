export type EmployeeRoleSql = "Admin" | "Magasinier" | "Personnel"

// UI User shape – mirrors the `employees` SQL table (camelCase)
export interface User {
  id: string               // employee_id as string
  username: string         // username
  badgeUuid: string        // badge_uuid
  firstName: string        // firstName
  lastName: string         // lastName
  role: EmployeeRoleSql    // Admin | Magasinier | Personnel
  createdAt: string        // createdAt
  updatedAt: string        // updatedAt
}

// For create / edit forms — no hashed fields
export interface UserFormData {
  username: string
  firstName: string
  lastName: string
  badgeUuid: string
  role: EmployeeRoleSql
  password?: string  // plain text; required on create, optional on edit
}

export interface Employee {
  employeeId: number
  username: string
  badgeUuid: string
  passwordHash: string
  firstName: string
  lastName: string
  role: EmployeeRoleSql
  createdAt: string
  updatedAt: string
}

export interface DeliveryDriver {
  driverId: number
  encryptedLastName: string
  encryptedFirstName: string
  company: string
  ppeCharterValid: boolean
  ppeSignatureDate: string | null
}

export type VehicleType = "LCV" | "HGV"

export interface Vehicle {
  vehicleId: number
  licensePlate: string
  vehicleType: VehicleType
  driverId: number
}

export interface Visitor {
  visitorId: number
  firstName: string
  lastName: string
  company: string
  employee: string | number | null
  arrivalTime: string
}

export type HistoryActionType = "Entry" | "Exit" | "Refusal"

export interface HistoryLog {
  logId: number
  dateTime: string
  actionType: HistoryActionType
  details: string
  employeeId: number
  vehicleId: number | null
  driverId: number | null
  visitorId: number | null
}
