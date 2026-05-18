"use client"

import * as React from "react"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/dashboard/users/users-table"
import { useEmployeesQuery } from "@/hooks/api/use-employees-query"
import { employeeToUser } from "@/lib/mappers/user-mapper"

export default function UsersPage() {
  const { data: employees = [], isLoading, isError, error } = useEmployeesQuery()

  const users = React.useMemo(() => employees.map(employeeToUser), [employees])

  const handleDelete = () => {
    toast.error("La suppression d'un employé n'est pas encore supportée par le backend")
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employés</h1>
            <p className="text-sm text-muted-foreground">
              Gérer les comptes du personnel, les rôles et les accès par badge
            </p>
          </div>
          <Link href="/dashboard/users/create">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter un employé
            </Button>
          </Link>
        </div>

        <div className="px-4 lg:px-6">
          {isLoading ? <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Chargement des employés...</div> : null}
          {isError ? (
            <div className="rounded-md border border-destructive/50 bg-card p-4 text-sm text-destructive">
              Impossible de charger les employés : {error instanceof Error ? error.message : "Erreur inconnue"}
            </div>
          ) : null}
          {!isLoading && !isError ? <UsersTable data={users} onDelete={handleDelete} /> : null}
        </div>
      </div>
    </div>
  )
}

