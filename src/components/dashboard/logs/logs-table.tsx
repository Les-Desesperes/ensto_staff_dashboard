"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHistoryLogsQuery } from "@/hooks/api/use-history-logs-query"

const actions = ["all", "Entry", "Exit", "Refusal"] as const

type ActionFilter = (typeof actions)[number]

export function InteractiveLogsTable() {
  const { data: logs = [], isLoading, isError, error } = useHistoryLogsQuery()
  const [query, setQuery] = React.useState("")
  const [actionFilter, setActionFilter] = React.useState<ActionFilter>("all")

  const filtered = React.useMemo(() => {
    return logs.filter((log) => {
      const haystack = `${log.details || ""} ${log.actionType} ${log.employeeId || ""} ${log.driverId || ""} ${log.visitorId || ""}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      const matchesAction = actionFilter === "all" || log.actionType === actionFilter
      return matchesQuery && matchesAction
    })
  }, [logs, query, actionFilter])

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Chargement des logs...</div>
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/50 bg-card p-4 text-sm text-destructive">
        Impossible de charger les logs: {error instanceof Error ? error.message : "Erreur inconnue"}
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold">Journaux d&apos;acces</h3>
          <p className="text-sm text-muted-foreground">
            {filtered.length} evenement(s) trouves sur {logs.length}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Rechercher details, employe, livreur..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full sm:w-64"
          />
          <div className="flex gap-2">
            {actions.map((action) => (
              <Button
                key={action}
                variant={actionFilter === action ? "default" : "outline"}
                size="sm"
                onClick={() => setActionFilter(action)}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Visitor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Aucun log trouve.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((log) => (
              <TableRow key={log.logId}>
                <TableCell>{new Date(log.dateTime).toLocaleString("fr-FR")}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.actionType}</Badge>
                </TableCell>
                <TableCell>{log.details || "-"}</TableCell>
                <TableCell>{log.employeeId ?? "-"}</TableCell>
                <TableCell>{log.driverId ?? "-"}</TableCell>
                <TableCell>{log.visitorId ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}