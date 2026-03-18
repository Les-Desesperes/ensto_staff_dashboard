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

// Données basées sur ton mock_data.sql
const mockVisiteurs = [
    { id: 1, fullName: "Sophie Martin", company: "Tech Solutions", arrivalTime: "2023-12-01T10:15:00Z" },
    { id: 2, fullName: "Lucas Bernard", company: "Maintenance Corp", arrivalTime: "2023-12-01T14:00:00Z" },
    { id: 3, fullName: "Emma Petit", company: "Audit Partners", arrivalTime: "2023-12-02T09:00:00Z" },
]

const columns: ColumnDef<typeof mockVisiteurs[0]>[] = [
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
                    {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
        </span>
            )
        },
    },
]

export function VisiteursTable() {
    const table = useReactTable({
        data: mockVisiteurs,
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
                    <Button size="sm">
                        <UserPlusIcon className="mr-2 size-4" /> Déclarer un visiteur
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

function VisiteurViewer({ item }: { item: typeof mockVisiteurs[0] }) {
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
                        <p className="text-xs text-muted-foreground">Dé-chiffré via AES-256 (Base de données sécurisée)</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Société</Label>
                        <Input value={item.company} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label>Date et Heure d'arrivée</Label>
                        <Input value={new Date(item.arrivalTime).toLocaleString('fr-FR')} readOnly />
                    </div>
                </div>
                <DrawerFooter>
                    <Button variant="default">Générer un badge d'accès</Button>
                    <DrawerClose asChild><Button variant="outline">Fermer</Button></DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}