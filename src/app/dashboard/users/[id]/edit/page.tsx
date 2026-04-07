"use client"

import * as React from "react"
import { isAxiosError } from "axios"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { type UserFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/components/dashboard/users/user-form"
import { employeeToUser } from "@/lib/mappers/user-mapper"
import { useEmployeeQuery } from "@/hooks/api/use-employee-query"

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const { data: employee, isPending, isError, error } = useEmployeeQuery(id)

  const user = React.useMemo(() => (employee ? employeeToUser(employee) : null), [employee])
  const isNotFound = isAxiosError(error) && error.response?.status === 404

  if (isPending) {
    return <div className="p-6 text-sm text-muted-foreground">Loading employee...</div>
  }

  if (isError) {
    if (isNotFound) {
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

    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Unable to load employee</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <Link href="/dashboard/users" className="mt-4 inline-block">
              <Button variant="outline">Back to Employees</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      toast.error("PATCH /employees/:id is not available in backend API yet")
      router.push("/dashboard/users")
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
