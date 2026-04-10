"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { GalleryVerticalEndIcon, Loader2 } from "lucide-react"

import { site } from "@/config/site"
import { useAuth } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, isBootstrapping } = useAuth()
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null)

    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field === "username" || field === "password") {
          form.setError(field, { message: issue.message })
        }
      })
      return
    }

    try {
      await login(parsed.data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to sign in")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEndIcon className="size-6" />
          </div>
          <h1 className="text-xl font-bold">Welcome to {site.name}</h1>
          <p className="text-sm text-muted-foreground">Use your employee credentials to sign in.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            autoComplete="username"
            {...form.register("username")}
          />
          {form.formState.errors.username ? (
            <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isBootstrapping}>
          {form.formState.isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {form.formState.isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  )
}
