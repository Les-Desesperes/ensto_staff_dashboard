"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit2, Trash2, ShieldCheck, Package, User2 } from "lucide-react"
import Link from "next/link"

import { type User } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UsersTableProps {
  data: User[]
  onDelete: (id: string) => void
}

const roleConfig = {
  Admin: {
    label: "Admin",
    className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800",
    icon: ShieldCheck,
  },
  Magasinie: {
    label: "Magasinié",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Package,
  },
  Personnel: {
    label: "Personnel",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    icon: User2,
  },
} as const

export function UsersTable({ data, onDelete }: UsersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean
    userId: string | null
    userName: string | null
  }>({ isOpen: false, userId: null, userName: null })

  const columns: ColumnDef<User>[] = [
    {
      id: "fullName",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </span>
          <span className="text-xs text-muted-foreground">@{row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
          {row.getValue("username")}
        </code>
      ),
    },
    {
      accessorKey: "badgeUuid",
      header: "Badge UUID",
      cell: ({ row }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono tracking-wider">
          {row.getValue("badgeUuid")}
        </code>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as keyof typeof roleConfig
        const config = roleConfig[role] ?? roleConfig.Personnel
        const Icon = config.icon
        return (
          <Badge
            variant="outline"
            className={`gap-1.5 font-medium ${config.className}`}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 -ml-2"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const raw = row.getValue("createdAt") as string
        const date = new Date(raw)
        return (
          <div className="flex flex-col text-sm">
            <span>{date.toLocaleDateString()}</span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex gap-2 justify-end">
            <Link href={`/dashboard/users/${user.id}/edit`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Edit2 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit {user.firstName}</span>
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                setDeleteDialog({
                  isOpen: true,
                  userId: user.id,
                  userName: `${user.firstName} ${user.lastName}`,
                })
              }
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete {user.firstName}</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  })

  const handleDeleteConfirm = () => {
    if (deleteDialog.userId) {
      onDelete(deleteDialog.userId)
      setDeleteDialog({ isOpen: false, userId: null, userName: null })
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Input
          placeholder="Search by name, username, badge or role…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} employee(s) found
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen: boolean) =>
          setDeleteDialog({ isOpen, userId: null, userName: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteDialog.userName}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
