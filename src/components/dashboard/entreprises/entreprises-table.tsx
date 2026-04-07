"use client"

import * as React from "react"
import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2Icon, PlusIcon } from "lucide-react"
import { useCompaniesQuery } from "@/hooks/api/use-companies-query"

interface CompanyRow {
    id: number
    name: string
    type: string
}

const columns: ColumnDef<CompanyRow>[] = [
    {
        accessorKey: "name",
        header: "Raison Sociale",
        cell: ({ row }) => <span className="font-semibold text-primary">{row.original.name}</span>,
    },
    {
        accessorKey: "type",
        header: "Type de partenariat",
        cell: ({ row }) => (
            <Badge variant={row.original.type === "Transporteur" ? "default" : "outline"} className="px-2">
                {row.original.type}
            </Badge>
        ),
    },
]

export function EntreprisesTable() {
    const { data: companies = [], isLoading, isError, error } = useCompaniesQuery()

    const data = React.useMemo<CompanyRow[]>(() => companies.map((company) => ({
        id: company.companyId,
        name: company.name,
        type: "Partenaire",
    })), [companies])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Building2Icon className="size-5 text-primary"/> Partenaires Enregistres
                </h2>
                <div className="flex gap-2">
                    <Button size="sm" disabled>
                        <PlusIcon className="mr-2 size-4" /> Ajouter une entreprise
                    </Button>
                </div>
            </div>

            {isLoading ? <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Chargement des entreprises...</div> : null}
            {isError ? (
                <div className="rounded-md border border-destructive/50 bg-card p-4 text-sm text-destructive">
                    Impossible de charger les entreprises. Le backend n&apos;expose peut-etre pas encore /company/: {error instanceof Error ? error.message : "Erreur inconnue"}
                </div>
            ) : null}

            {!isLoading && !isError ? (
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((h) => <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">Aucune entreprise trouvee.</TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : null}
        </div>
    )
}