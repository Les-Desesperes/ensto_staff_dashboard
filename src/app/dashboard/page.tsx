import {ChartAreaInteractive} from "@/components/dashboard/chart-area-interactive"
import {EmployeesTable} from "@/components/dashboard/data-table"
import {SectionCards} from "@/components/dashboard/section-cards"
import {employeeSchema} from "@/lib/employee-schema"

import data from "./data.json"

export default function Page() {
    const employeesData = employeeSchema.array().parse(data)

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards/>
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive/>
                </div>
                <EmployeesTable data={employeesData}/>
            </div>
        </div>
    )
}
