"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { type Employee } from "@/lib/employee-schema"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  GripVerticalIcon,
  CircleCheckIcon,
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  UserPlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  ShieldAlertIcon
} from "lucide-react"

// Données factices pour l'exemple
export const mockEmployees: Employee[] = [
  { id: 1, username: "j.oudart", role: "Admin", status: "Actif", lastLogin: "Aujourd'hui, 08h30", securityIssue: false },
  { id: 2, username: "v.dupont", role: "WarehouseWorker", status: "Actif", lastLogin: "Hier, 14h15", securityIssue: false },
  { id: 3, username: "m.martin", role: "WarehouseWorker", status: "Suspendu", lastLogin: "Il y a 3 mois", securityIssue: true },
  { id: 4, username: "s.admin", role: "Admin", status: "Actif", lastLogin: "Aujourd'hui, 09h00", securityIssue: false },
]

// 2. Bouton pour le drag & drop
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })

  return (
      <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:bg-transparent"
      >
        <GripVerticalIcon className="size-3 text-muted-foreground" />
        <span className="sr-only">Réorganiser</span>
      </Button>
  )
}

// 3. Définition des colonnes adaptées
const columns: ColumnDef<Employee>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Sélectionner tout"
          />
        </div>
    ),
    cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Sélectionner la ligne"
          />
        </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Identifiant",
    cell: ({ row }) => <EmployeeViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Rôle (Permissions)",
    cell: ({ row }) => (
        <div className="w-32">
          <Badge variant={row.original.role === "Admin" ? "default" : "secondary"} className="px-1.5">
            {row.original.role === "Admin" ? "Administrateur" : "Magasinier"}
          </Badge>
        </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut Compte",
    cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.status === "Actif" ? (
              <CircleCheckIcon className="fill-green-500 dark:fill-green-400 mr-1 size-3" />
          ) : (
              <ShieldAlertIcon className="text-destructive mr-1 size-3" />
          )}
          {row.original.status}
        </Badge>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Dernière connexion",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastLogin}</span>,
  },
  {
    id: "actions",
    cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
              <EllipsisVerticalIcon />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Modifier le rôle</DropdownMenuItem>
            <DropdownMenuItem>Réinitialiser MDP</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Suspendre le compte</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
]

// 4. Composant de ligne pour le Drag & Drop
function DraggableRow({ row }: { row: Row<Employee> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id: row.original.id })

  return (
      <TableRow
          data-state={row.getIsSelected() && "selected"}
          data-dragging={isDragging}
          ref={setNodeRef}
          className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
          style={{ transform: CSS.Transform.toString(transform), transition: transition }}
      >
        {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
        ))}
      </TableRow>
  )
}

// 5. La table principale
export function EmployeesTable({ data: initialData = mockEmployees }: { data?: Employee[] }) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const sortableId = React.useId()
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data])

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, rowSelection, pagination },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
      <div className="w-full flex-col justify-start gap-6 space-y-4">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <h2 className="text-xl font-semibold">Gestion du Personnel</h2>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3Icon className="mr-2 size-4" />
                  Colonnes
                  <ChevronDownIcon className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((column) => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm">
              <UserPlusIcon className="mr-2 size-4" />
              <span className="hidden lg:inline">Ajouter un employé</span>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-lg border">
            <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
              <Table>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                      </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                      <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                        {table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)}
                      </SortableContext>
                  ) : (
                      <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Aucun résultat.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </div>
      </div>
  )
}

// 6. Tiroir (Drawer) pour voir/éditer les infos de l'employé
function EmployeeViewer({ item }: { item: Employee }) {
  const isMobile = useIsMobile()

  return (
      <Drawer direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger asChild>
          <Button variant="link" className="w-fit px-0 font-medium text-primary">
            {item.username}
          </Button>
        </DrawerTrigger>
        <DrawerContent className={isMobile ? "" : "w-screen max-w-sm"}>
          <DrawerHeader>
            <DrawerTitle>Profil Employé : {item.username}</DrawerTitle>
            <DrawerDescription>Gérer les accès et les informations de ce compte.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-6 px-4 py-4">
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Identifiant de connexion</Label>
                <Input id="username" defaultValue={item.username} />
              </div>

              <div className="flex flex-col gap-2">
                    <Label htmlFor="role">Niveau d&apos;Acces</Label>
                <Select defaultValue={item.role}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Admin">Administrateur (Complet)</SelectItem>
                      <SelectItem value="WarehouseWorker">Magasinier (Limité)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Statut du Compte</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Actif">Actif (Autorisé)</SelectItem>
                      <SelectItem value="Suspendu">Suspendu (Accès Révoqué)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </form>

            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Détails de sécurité</p>
              <p className="text-muted-foreground">Dernière connexion : {item.lastLogin}</p>
              {item.securityIssue && (
                  <p className="text-destructive mt-2 flex items-center">
                    <ShieldAlertIcon className="mr-2 size-4" />
                    Mot de passe expiré ou compromis.
                  </p>
              )}
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => toast.success("Modifications enregistrées")}>Sauvegarder</Button>
            <DrawerClose asChild>
              <Button variant="outline">Annuler</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  )
}