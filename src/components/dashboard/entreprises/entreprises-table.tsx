"use client"

import * as React from "react"
import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2Icon, PlusIcon, PhoneIcon } from "lucide-react"

// Compilation des entreprises vues dans tes mocks (Fast Logistics, Tech Solutions...)
const mockEntreprises = [
    { id: 1, name: "Fast Logistics", type: "Transporteur", contact: "01 23 45 67 89" },
    { id: 2, name: "Global Freight", type: "Transporteur", contact: "01 98 76 54 32" },
    { id: 3, name: "Local Transports", type: "Transporteur", contact: "03 45 67 89 10" },
    { id: 4, name: "Tech Solutions", type: "Prestataire Externe", contact: "04 56 12 34 78" },
    { id: 5, name: "Maintenance Corp", type: "Prestataire Externe", contact: "02 34 56 78 90" },
    { id: 6, name: "Audit Partners", type: "Prestataire Externe", contact: "05 67 89 12 34" },
]

const columns: ColumnDef<typeof mockEntreprises[0]>[] = [
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
    {
        accessorKey: "contact",
        header: "Numéro de Contact",
        cell: ({ row }) => (
            <span className="text-sm flex items-center gap-2 text-muted-foreground">
        <PhoneIcon className="size-3" />
                {row.original.contact}
      </span>
        ),
    },
]

export function EntreprisesTable() {
    const table = useReactTable({
        data: mockEntreprises,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Building2Icon className="size-5 text-primary"/> Partenaires Enregistrés
                </h2>
                <div className="flex gap-2">
                    <Button size="sm">
                        <PlusIcon className="mr-2 size-4" /> Ajouter une entreprise
                    </Button>
                </div>
            </div>
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
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}