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

const mockLivreurs = [
    { id: 1, firstName: "Jean", lastName: "Dupont", company: "Fast Logistics", ppeValid: true, ppeDate: "2023-10-01 08:30:00" },
    { id: 2, firstName: "Marc", lastName: "Lefevre", company: "Global Freight", ppeValid: true, ppeDate: "2023-11-15 09:00:00" },
    { id: 3, firstName: "Alain", lastName: "Leroy", company: "Local Transports", ppeValid: false, ppeDate: null },
]

const columns: ColumnDef<typeof mockLivreurs[0]>[] = [
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
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.ppeDate ? new Date(row.original.ppeDate).toLocaleDateString('fr-FR') : "N/A"}</span>,
    },
]

export function LivreursTable() {
    const [data] = React.useState(() => mockLivreurs)
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
                    <Button size="sm">
                        <UserPlusIcon className="mr-2 size-4" /> Ajouter un chauffeur
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

function LivreurViewer({ item }: { item: typeof mockLivreurs[0] }) {
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
                    <DrawerDescription>Gestion des autorisations d'accès.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input value={`${item.firstName} ${item.lastName}`} disabled />
                        <p className="text-xs text-muted-foreground">Dé-chiffré via AES-256 (Base de données sécurisée)</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Société affiliée</Label>
                        <Input value={item.company} readOnly />
                    </div>
                    <div className="p-4 rounded-lg bg-muted space-y-2">
                        <Label className="font-semibold">Statut Charte EPI</Label>
                        {item.ppeValid ? (
                            <div className="text-sm text-green-600 flex items-center gap-2"><ShieldCheckIcon className="size-4"/> Valide (Signée le {new Date(item.ppeDate!).toLocaleDateString('fr-FR')})</div>
                        ) : (
                            <div className="text-sm text-destructive flex items-center gap-2"><ShieldAlertIcon className="size-4"/> Non signée - Accès entrepôt interdit</div>
                        )}
                    </div>
                </div>
                <DrawerFooter>
                    <Button variant="default">{item.ppeValid ? "Révoquer la charte" : "Valider la charte"}</Button>
                    <DrawerClose asChild><Button variant="outline">Fermer</Button></DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}