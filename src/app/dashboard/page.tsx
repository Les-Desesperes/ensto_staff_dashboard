"use client"

import * as React from "react"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { EmployeesTable } from "@/components/dashboard/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { useEmployeesQuery } from "@/hooks/api/use-employees-query"

export default function Page() {
    const { data: employees = [] } = useEmployeesQuery()

    const employeesData = React.useMemo(
        () =>
            employees.map((employee) => ({
                id: employee.employeeId,
                username: employee.username,
                role: (employee.role === "Admin" ? "Admin" : "WarehouseWorker") as "Admin" | "WarehouseWorker",
                status: "Actif" as const,
                lastLogin: new Date(employee.updatedAt).toLocaleString("fr-FR"),
                securityIssue: false,
            })),
        [employees],
    )

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
                <EmployeesTable data={employeesData} />
            </div>
        </div>
    )
}
