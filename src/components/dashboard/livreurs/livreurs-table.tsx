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
import { UserPlusIcon, ShieldCheckIcon, ShieldAlertIcon, TruckIcon } from "lucide-react"
import { useDriversQuery } from "@/hooks/api/use-drivers-query"

interface DriverRow {
    id: number
    firstName: string
    lastName: string
    company: string
    ppeValid: boolean
    ppeDate: string | null
}

const columns: ColumnDef<DriverRow>[] = [
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
        accessorKey: "lastName",
        header: "Nom du Chauffeur",
        cell: ({ row }) => <LivreurViewer item={row.original} />,
    },
    {
        accessorKey: "company",
        header: "Entreprise (Transporteur)",
        cell: ({ row }) => <span className="font-medium text-muted-foreground">{row.original.company}</span>,
    },
    {
        accessorKey: "ppeValid",
        header: "Charte Sécurité (EPI)",
        cell: ({ row }) => (
            <Badge variant="outline" className={row.original.ppeValid ? "border-green-500 text-green-600 bg-green-50/50" : "border-destructive text-destructive bg-destructive/10"}>
                {row.original.ppeValid ? <ShieldCheckIcon className="mr-1 size-3" /> : <ShieldAlertIcon className="mr-1 size-3" />}
                {row.original.ppeValid ? "Signée" : "Non Valide"}
            </Badge>
        ),
    },
    {
        accessorKey: "ppeDate",
        header: "Date de signature",
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.ppeDate ? new Date(row.original.ppeDate).toLocaleDateString("fr-FR") : "N/A"}</span>,
    },
]

export function LivreursTable() {
    const { data: drivers = [], isLoading, isError, error } = useDriversQuery()

    const data = React.useMemo<DriverRow[]>(() => {
        return drivers.map((driver) => ({
            id: driver.driverId,
            firstName: `Livreur #${driver.driverId}`,
            lastName: "(chiffré)",
            company: driver.company,
            ppeValid: driver.ppeCharterValid,
            ppeDate: driver.ppeSignatureDate,
        }))
    }, [drivers])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2"><TruckIcon className="size-5 text-primary"/> Base Chauffeurs</h2>
                <div className="flex gap-2">
                    <Button size="sm" disabled>
                        <UserPlusIcon className="mr-2 size-4" /> Ajouter un chauffeur
                    </Button>
                </div>
            </div>

            {isLoading ? <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Chargement des chauffeurs...</div> : null}
            {isError ? (
                <div className="rounded-md border border-destructive/50 bg-card p-4 text-sm text-destructive">
                    Impossible de charger les chauffeurs: {error instanceof Error ? error.message : "Erreur inconnue"}
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
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">Aucun chauffeur trouvé.</TableCell>
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

function LivreurViewer({ item }: { item: DriverRow }) {
    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>
                <Button variant="link" className="px-0 font-medium text-primary">
                    {item.firstName} {item.lastName.toUpperCase()}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="w-screen max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>Fiche Livreur</DrawerTitle>
                    <DrawerDescription>Gestion des autorisations d&apos;accès.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input value={`${item.firstName} ${item.lastName}`} disabled />
                        <p className="text-xs text-muted-foreground">Les noms sont chiffrés par le backend et ne sont pas exposés dans cette API.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Société affiliée</Label>
                        <Input value={item.company} readOnly />
                    </div>
                    <div className="p-4 rounded-lg bg-muted space-y-2">
                        <Label className="font-semibold">Statut Charte EPI</Label>
                        {item.ppeValid ? (
                            <div className="text-sm text-green-600 flex items-center gap-2"><ShieldCheckIcon className="size-4"/> Valide {item.ppeDate ? `(Signée le ${new Date(item.ppeDate).toLocaleDateString("fr-FR")})` : ""}</div>
                        ) : (
                            <div className="text-sm text-destructive flex items-center gap-2"><ShieldAlertIcon className="size-4"/> Non signée - Accès entrepôt interdit</div>
                        )}
                    </div>
                </div>
                <DrawerFooter>
                    <Button variant="default" disabled>{item.ppeValid ? "Révoquer la charte" : "Valider la charte"}</Button>
                    <DrawerClose asChild><Button variant="outline">Fermer</Button></DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}