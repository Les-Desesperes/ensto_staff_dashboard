"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { type UserFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/components/dashboard/users/user-form"
import { useCreateEmployeeMutation } from "@/hooks/api/use-create-employee-mutation"

export default function CreateUserPage() {
  const router = useRouter()
  const createEmployee = useCreateEmployeeMutation()

  const handleSubmit = async (data: UserFormData) => {
    try {
      await createEmployee.mutateAsync({
        username: data.username,
        badgeUuid: data.badgeUuid,
        password: data.password || "",
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      toast.success("Employé créé avec succès !")
      router.push("/dashboard/users")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de la création de l'employé")
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center gap-2 px-4 lg:px-6">
          <Link href="/dashboard/users">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajouter un employé</h1>
            <p className="text-sm text-muted-foreground">
              Enregistrer un nouveau compte d'employé et son badge
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6 flex-1">
          <UserForm onSubmit={handleSubmit} isLoading={createEmployee.isPending} />
        </div>
      </div>
    </div>
  )
}

