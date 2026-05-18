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
  username: z.string().trim().min(1, "L'identifiant est requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
      setSubmitError(error instanceof Error ? error.message : "Impossible de se connecter")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEndIcon className="size-6" />
          </div>
          <h1 className="text-xl font-bold">Bienvenue sur {site.name}</h1>
          <p className="text-sm text-muted-foreground">Utilisez vos identifiants de personnel pour vous connecter.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Identifiant</Label>
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
          <Label htmlFor="password">Mot de passe</Label>
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
          {form.formState.isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  )
}

