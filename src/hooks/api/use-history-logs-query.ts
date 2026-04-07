import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { HistoryLogService } from "@/lib/api/services/history-log.service"

export function useHistoryLogsQuery() {
  return useQuery({
    queryKey: queryKeys.historyLogs.all,
    queryFn: HistoryLogService.getAllHistoryLogs,
  })
}

