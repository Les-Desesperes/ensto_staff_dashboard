"use client"

import * as React from "react"
import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {CarFrontIcon, TruckIcon} from "lucide-react"

// Données basées sur ton mock_data.sql (LCV = Léger, HGV = Lourd)
const mockVehicles = [
    { id: 1, plate: "AA-123-BB", type: "LCV", driverId: 1 },
    { id: 2, plate: "CD-456-EF", type: "HGV", driverId: 2 },
    { id: 3, plate: "GH-789-IJ", type: "LCV", driverId: 3 },
    { id: 4, plate: "KL-012-MN", type: "HGV", driverId: 1 },
]

const columns: ColumnDef<typeof mockVehicles[0]>[] = [
    {
        accessorKey: "plate",
        header: "Plaque d'immatriculation",
        cell: ({ row }) => <span className="font-mono text-base font-bold bg-muted px-2 py-1 rounded border border-border/50">{row.original.plate}</span>,
    },
    {
        accessorKey: "type",
        header: "Type de Véhicule",
        cell: ({ row }) => (
            <Badge variant="secondary" className="px-2">
                {row.original.type === "HGV" ? <TruckIcon className="mr-2 size-3" /> : <CarFrontIcon className="mr-2 size-3" />}
                {row.original.type === "HGV" ? "Poids Lourd (HGV)" : "Véhicule Léger (LCV)"}
            </Badge>
        ),
    },
    {
        accessorKey: "driverId",
        header: "ID Chauffeur affilié",
        cell: ({ row }) => <span className="text-muted-foreground">Chauffeur #{row.original.driverId}</span>,
    },
]

export function VehiculesTable() {
    const table = useReactTable({
        data: mockVehicles,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full space-y-4">
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