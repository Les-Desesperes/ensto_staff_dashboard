"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { type User, type UserFormData, type EmployeeRoleSql } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface UserFormProps {
  initialData?: User
  onSubmit: (data: UserFormData) => void
  isLoading?: boolean
}

const roleLabels: Record<EmployeeRoleSql, string> = {
  Admin: "Admin",
  Magasinie: "Magasinié",
  Personnel: "Personnel",
}

export function UserForm({ initialData, onSubmit, isLoading = false }: UserFormProps) {
  const router = useRouter()
  const isEdit = Boolean(initialData)

  const [formData, setFormData] = React.useState<UserFormData>({
    firstName: initialData?.firstName ?? "",
    lastName: initialData?.lastName ?? "",
    username: initialData?.username ?? "",
    badgeUuid: initialData?.badgeUuid ?? "",
    role: initialData?.role ?? "Personnel",
    password: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = React.useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Only lowercase letters, numbers and underscores"
    }
    if (!formData.badgeUuid.trim()) {
      newErrors.badgeUuid = "Badge UUID is required"
    } else if (!/^[0-9A-Fa-f]{8}$/.test(formData.badgeUuid)) {
      newErrors.badgeUuid = "Must be exactly 8 hex characters (e.g. B053AF25)"
    }
    if (!isEdit && !formData.password?.trim()) {
      newErrors.password = "Password is required for new employees"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    onSubmit(formData)
  }

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined as unknown as string }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isEdit ? "Edit Employee" : "Create New Employee"}</CardTitle>
            <CardDescription>
              {isEdit ? "Update employee information" : "Register a new employee in the system"}
            </CardDescription>
          </div>
          {isEdit && initialData && (
            <Badge variant="outline" className="font-mono text-xs">
              ID #{initialData.id}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jean"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Username + Badge UUID row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="jdupont_admin"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
                disabled={isLoading}
                className="font-mono"
              />
              {errors.username ? (
                <p className="text-sm text-destructive">{errors.username}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers and underscores
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="badgeUuid">Badge UUID</Label>
              <Input
                id="badgeUuid"
                placeholder="B053AF25"
                value={formData.badgeUuid}
                onChange={(e) => handleChange("badgeUuid", e.target.value.toUpperCase())}
                disabled={isLoading}
                maxLength={8}
                className="font-mono tracking-widest uppercase"
              />
              {errors.badgeUuid ? (
                <p className="text-sm text-destructive">{errors.badgeUuid}</p>
              ) : (
                <p className="text-xs text-muted-foreground">8-character hex ID from the badge</p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: EmployeeRoleSql) => handleChange("role", value)}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(roleLabels) as EmployeeRoleSql[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleLabels[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password{" "}
              {isEdit && (
                <span className="text-xs text-muted-foreground font-normal">(leave blank to keep current)</span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isEdit ? "••••••••" : "Enter a secure password"}
                value={formData.password ?? ""}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Separator />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving…" : isEdit ? "Update Employee" : "Create Employee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

