"use client"

import * as React from "react"
import {
    ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ContactIcon, UserPlusIcon, Building2Icon, CalendarIcon } from "lucide-react"
import { useVisitorsQuery } from "@/hooks/api/use-visitors-query"

interface VisitorRow {
    id: number
    fullName: string
    company: string
    arrivalTime: string
}

const columns: ColumnDef<VisitorRow>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
    },
    {
        accessorKey: "fullName",
        header: "Nom du Visiteur",
        cell: ({ row }) => <VisiteurViewer item={row.original} />,
    },
    {
        accessorKey: "company",
        header: "Société Représentée",
        cell: ({ row }) => (
            <Badge variant="secondary" className="px-2 font-medium">
                <Building2Icon className="mr-2 size-3" />
                {row.original.company}
            </Badge>
        ),
    },
    {
        accessorKey: "arrivalTime",
        header: "Heure d'arrivée prévue",
        cell: ({ row }) => {
            const date = new Date(row.original.arrivalTime)
            return (
                <span className="text-sm flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="size-4" />
                    {date.toLocaleDateString("fr-FR")} a {date.toLocaleTimeString("fr-FR", {hour: "2-digit", minute:"2-digit"})}
        </span>
            )
        },
    },
]

export function VisiteursTable() {
    const { data: visitors = [], isLoading, isError, error } = useVisitorsQuery()
    const data = React.useMemo<VisitorRow[]>(() => visitors.map((visitor) => ({
        id: visitor.visitorId,
        fullName: visitor.fullName,
        company: visitor.company,
        arrivalTime: visitor.arrivalTime,
    })), [visitors])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ContactIcon className="size-5 text-primary"/> Registre des Visiteurs
                </h2>
                <div className="flex gap-2">
                    <Button size="sm" disabled>
                        <UserPlusIcon className="mr-2 size-4" /> Déclarer un visiteur
                    </Button>
                </div>
            </div>

            {isLoading ? <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Chargement des visiteurs...</div> : null}
            {isError ? (
                <div className="rounded-md border border-destructive/50 bg-card p-4 text-sm text-destructive">
                    Impossible de charger les visiteurs: {error instanceof Error ? error.message : "Erreur inconnue"}
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
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">Aucun visiteur trouvé.</TableCell>
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

function VisiteurViewer({ item }: { item: VisitorRow }) {
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button variant="link" className="px-0 font-medium text-primary">
                    {item.fullName}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="w-screen max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>Fiche Visiteur</DrawerTitle>
                    <DrawerDescription>Détails du visiteur temporaire.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input value={item.fullName} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Société</Label>
                        <Input value={item.company} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label>Date et Heure d'arrivée</Label>
                        <Input value={new Date(item.arrivalTime).toLocaleString("fr-FR")} readOnly />
                    </div>
                </div>
                <DrawerFooter>
                    <Button variant="default" disabled>Générer un badge d&apos;accès</Button>
                    <DrawerClose asChild><Button variant="outline">Fermer</Button></DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}