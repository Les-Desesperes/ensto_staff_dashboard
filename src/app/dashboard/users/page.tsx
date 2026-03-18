"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import { toast } from "sonner"

import { type User } from "@/lib/types"
import { mockUsers } from "@/lib/users-data"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/dashboard/users/users-table"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success("Employee deleted successfully")
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-sm text-muted-foreground">
              Manage staff accounts, roles, and badge access
            </p>
          </div>
          <Link href="/dashboard/users/create">
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </div>

        <div className="px-4 lg:px-6">
          <UsersTable data={users} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  )
}

