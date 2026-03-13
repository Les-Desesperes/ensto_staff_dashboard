import {InteractiveLogsTable} from "@/components/dashboard/logs/logs-table";

export default function LogsPage() {
    return (
        <div className="container flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <InteractiveLogsTable/>
            </div>
        </div>
    )
}