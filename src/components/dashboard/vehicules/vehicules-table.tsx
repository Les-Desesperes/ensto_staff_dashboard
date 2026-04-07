"use client"

import * as React from "react"
import {
    ColumnDef, flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {CarFrontIcon, TruckIcon} from "lucide-react"
import { type Vehicle } from "@/lib/api/types"
import { useVehiclesQuery } from "@/hooks/api/use-vehicles-query"

const columns: ColumnDef<Vehicle>[] = [
    {
        accessorKey: "licensePlate",
        header: "Plaque d'immatriculation",
        cell: ({ row }) => <span className="font-mono text-base font-bold bg-muted px-2 py-1 rounded border border-border/50">{row.original.licensePlate}</span>,
    },
    {
        accessorKey: "vehicleType",
        header: "Type de Véhicule",
        cell: ({ row }) => (
            <Badge variant="secondary" className="px-2">
                {row.original.vehicleType === "HGV" ? <TruckIcon className="mr-2 size-3" /> : <CarFrontIcon className="mr-2 size-3" />}
                {row.original.vehicleType === "HGV" ? "Poids Lourd (HGV)" : "Véhicule Léger (LCV)"}
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
    const { data: vehicles = [], isLoading, isError, error } = useVehiclesQuery()

    const table = useReactTable({
        data: vehicles,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Chargement des véhicules...</div>
    }

    if (isError) {
        return (
            <div className="rounded-md border border-destructive/50 bg-card p-4 text-sm text-destructive">
                Impossible de charger les véhicules: {error instanceof Error ? error.message : "Erreur inconnue"}
            </div>
        )
    }

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
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    Aucun véhicule trouvé.
                                </TableCell>
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
        </div>
    )
}