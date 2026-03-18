"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { type UserFormData } from "@/lib/types"
import { mockUsers } from "@/lib/users-data"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/components/dashboard/users/user-form"

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const user = mockUsers.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Employee Not Found</h1>
            <p className="text-sm text-muted-foreground mt-2">
              No employee with ID <code className="font-mono">#{id}</code> exists.
            </p>
            <Link href="/dashboard/users" className="mt-4 inline-block">
              <Button>Back to Employees</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // In production: PATCH /api/employees/:id
      console.log("Updating employee:", {
        id: user.id,
        ...data,
        password: data.password ? "[REDACTED]" : undefined,
      })
      toast.success(`${user.firstName} ${user.lastName} updated successfully!`)
      router.push("/dashboard/users")
    } catch {
      toast.error("Failed to update employee")
    } finally {
      setIsLoading(false)
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Employee</h1>
            <p className="text-sm text-muted-foreground">
              Update {user.firstName} {user.lastName}&apos;s account
            </p>
          </div>
        </div>

        <div className="px-4 lg:px-6 flex-1">
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
