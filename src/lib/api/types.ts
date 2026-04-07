export interface ApiSuccess<T> {
  success: true
  message?: string
  data: T
}

export interface ApiError {
  success: false
  message: string
  data?: null
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export class ApiResponseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiResponseError"
  }
}

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new ApiResponseError(response.message || "Request failed")
  }

  return response.data
}

export type EmployeeRole = "Admin" | "Magasinier" | "Personnel"

export interface Employee {
  employeeId: number
  username: string
  badgeUuid: string
  passwordHash: string
  firstName: string
  lastName: string
  role: EmployeeRole
  createdAt: string
  updatedAt: string
}

export interface CreateEmployeeBody {
  username: string
  badgeUuid: string
  password: string
  role: EmployeeRole
  firstName: string
  lastName: string
}

export interface DeliveryDriver {
  driverId: number
  encryptedLastName: string
  encryptedFirstName: string
  company: string
  ppeCharterValid: boolean
  ppeSignatureDate: string | null
}

export interface CreateDriverBody {
  firstName: string
  lastName: string
  companyId: string
  ppeCharterValid?: boolean
  ppeSignatureDate?: string
}

export type VehicleType = "LCV" | "HGV"

export interface Vehicle {
  vehicleId: number
  licensePlate: string
  vehicleType: VehicleType
  driverId: number
}

export interface StoreTempPlateBody {
  licensePlate: string
}

export interface Visitor {
  visitorId: number
  fullName: string
  company: string
  arrivalTime: string
}

export interface CreateVisitorBody {
  fullName: string
  company: string
  arrivalTime: string
}

export type ActionType = "Entry" | "Exit" | "Refusal"

export interface HistoryLog {
  logId: number
  dateTime: string
  actionType: ActionType
  details?: string
  employeeId?: number
  vehicleId?: number | null
  driverId?: number | null
  visitorId?: number | null
}

export interface CreateHistoryLogBody {
  actionType: ActionType
  details?: string
  dateTime?: string
}
