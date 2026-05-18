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
import { useCreateCompanyMutation } from "@/hooks/api/use-create-company-mutation"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

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
    const createCompanyMutation = useCreateCompanyMutation()
    const [isOpen, setIsOpen] = React.useState(false)
    const [name, setName] = React.useState("")

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error("Veuillez entrer un nom d'entreprise valide.")
            return
        }
        try {
            await createCompanyMutation.mutateAsync({ name })
            toast.success("Entreprise ajoutée avec succès !")
            setName("")
            setIsOpen(false)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur lors de la création de l'entreprise.")
        }
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Building2Icon className="size-5 text-primary"/> Partenaires Enregistrés
                </h2>
                <div className="flex gap-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button size="sm">
                                <PlusIcon className="mr-2 size-4" /> Ajouter une entreprise
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Ajouter une entreprise</SheetTitle>
                                <SheetDescription>
                                    Enregistrez une nouvelle entreprise partenaire dans le système.
                                </SheetDescription>
                            </SheetHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company-name">Raison Sociale</Label>
                                    <Input
                                        id="company-name"
                                        placeholder="Ex: Ensto SAS"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <SheetFooter className="pt-4">
                                    <Button type="submit" disabled={createCompanyMutation.isPending} className="w-full">
                                        {createCompanyMutation.isPending ? "Création..." : "Ajouter"}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </SheetContent>
                    </Sheet>
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
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">Aucune entreprise trouvée.</TableCell>
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