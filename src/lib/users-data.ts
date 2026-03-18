import {
  type DeliveryDriver,
  type Employee,
  type HistoryLog,
  type User,
  type Vehicle,
  type Visitor,
} from "./types"

function toUser(employee: Employee): User {
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

// SQL-aligned employees mock.
export const mockEmployees: Employee[] = [
  {
    employeeId: 1,
    username: "jdupont_admin",
    badgeUuid: "B053AF25",
    passwordHash:
      "e8ad1535229f6332f181ae4ecbf3f17d9f5f2f5a31ed6b15166f0f7f937b4f8f",
    firstName: "Jean",
    lastName: "Dupont",
    role: "Admin",
    createdAt: "2023-12-01 07:45:00",
    updatedAt: "2023-12-01 07:45:00",
  },
  {
    employeeId: 2,
    username: "mlefevre_wh",
    badgeUuid: "A1C9D4F0",
    passwordHash:
      "f21f6e6f8f2f6f95d1c46d2e1af3c0f52e89f29c45a5f6f8e4a2279a8f86b835",
    firstName: "Marie",
    lastName: "Lefevre",
    role: "Magasinie",
    createdAt: "2023-12-01 07:50:00",
    updatedAt: "2023-12-01 07:50:00",
  },
  {
    employeeId: 3,
    username: "aleroi_wh",
    badgeUuid: "9E77BC12",
    passwordHash:
      "f21f6e6f8f2f6f95d1c46d2e1af3c0f52e89f29c45a5f6f8e4a2279a8f86b835",
    firstName: "Alex",
    lastName: "Leroi",
    role: "Personnel",
    createdAt: "2023-12-01 07:55:00",
    updatedAt: "2023-12-01 07:55:00",
  },
]

export const mockDeliveryDrivers: DeliveryDriver[] = [
  {
    driverId: 1,
    encryptedLastName:
      "e33072e62921354c73a999339f910c89:328fbf70b5d57565fe7fcd4e657ee1b7",
    encryptedFirstName:
      "293e8632f8b0c20de2364698b7a4de53:84f8ea0b2c5131addc3222b2ea33b647",
    company: "Fast Logistics",
    ppeCharterValid: true,
    ppeSignatureDate: "2023-10-01 08:30:00",
  },
  {
    driverId: 2,
    encryptedLastName:
      "d5bdc1ded531b9bdedfcd9d16882e541:07e0cf4f29ce33a82079c1ba1e9304f6",
    encryptedFirstName:
      "8ccc27f8e0175403ed71b9ecd9d350a6:7cf94d1ac2c069c730f1b31507617533",
    company: "Global Freight",
    ppeCharterValid: true,
    ppeSignatureDate: "2023-11-15 09:00:00",
  },
  {
    driverId: 3,
    encryptedLastName:
      "958f4aff9442c507147c3e4e73a58065:2bbb83dfd61a7b478e8c452bec41c8e1",
    encryptedFirstName:
      "7764609094bf3ea37a1c4e02c1546501:074c9d2a477bff9826120e5768876588",
    company: "Local Transports",
    ppeCharterValid: false,
    ppeSignatureDate: null,
  },
]

export const mockVehicles: Vehicle[] = [
  { vehicleId: 1, licensePlate: "AA-123-BB", vehicleType: "LCV", driverId: 1 },
  { vehicleId: 2, licensePlate: "CD-456-EF", vehicleType: "HGV", driverId: 2 },
  { vehicleId: 3, licensePlate: "GH-789-IJ", vehicleType: "LCV", driverId: 3 },
  { vehicleId: 4, licensePlate: "KL-012-MN", vehicleType: "HGV", driverId: 1 },
]

export const mockVisitors: Visitor[] = [
  {
    visitorId: 1,
    fullName: "Sophie Martin",
    company: "Tech Solutions",
    arrivalTime: "2023-12-01 10:15:00",
  },
  {
    visitorId: 2,
    fullName: "Lucas Bernard",
    company: "Maintenance Corp",
    arrivalTime: "2023-12-01 14:00:00",
  },
  {
    visitorId: 3,
    fullName: "Emma Petit",
    company: "Audit Partners",
    arrivalTime: "2023-12-02 09:00:00",
  },
]

export const mockHistoryLogs: HistoryLog[] = [
  {
    logId: 1,
    dateTime: "2023-12-01 08:00:00",
    actionType: "Entry",
    details: "Routine delivery scan",
    employeeId: 2,
    vehicleId: 1,
    driverId: 1,
    visitorId: null,
  },
  {
    logId: 2,
    dateTime: "2023-12-01 08:45:00",
    actionType: "Exit",
    details: "Delivery completed",
    employeeId: 2,
    vehicleId: 1,
    driverId: 1,
    visitorId: null,
  },
  {
    logId: 3,
    dateTime: "2023-12-01 10:15:00",
    actionType: "Entry",
    details: "Meeting with management",
    employeeId: 1,
    vehicleId: null,
    driverId: null,
    visitorId: 1,
  },
  {
    logId: 4,
    dateTime: "2023-12-01 11:00:00",
    actionType: "Refusal",
    details: "PPE charter not signed by driver",
    employeeId: 3,
    vehicleId: 3,
    driverId: 3,
    visitorId: null,
  },
  {
    logId: 5,
    dateTime: "2023-12-01 12:30:00",
    actionType: "Exit",
    details: "Meeting finished",
    employeeId: 1,
    vehicleId: null,
    driverId: null,
    visitorId: 1,
  },
]

// Existing Users UI consumes this transformed shape.
export const mockUsers: User[] = mockEmployees.map(toUser)

