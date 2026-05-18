"use client"

import * as React from "react"
import { ZodError } from "zod"
import { toast } from "sonner"
import { useCreateDriverMutation } from "@/hooks/api/use-create-driver-mutation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const initialState = {
  firstName: "",
  lastName: "",
  companyId: "",
  ppeCharterValid: true,
  ppeSignatureDate: "",
}

interface CreateDriverFormProps {
  onSuccess?: () => void
}

export function CreateDriverForm({ onSuccess }: CreateDriverFormProps) {
  const [form, setForm] = React.useState(initialState)
  const createDriver = useCreateDriverMutation()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const payload = {
        ...form,
        ppeSignatureDate: form.ppeSignatureDate || undefined,
      }

      await createDriver.mutateAsync(payload)
      toast.success("Chauffeur enregistré avec succès !")
      setForm(initialState)
      onSuccess?.()
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message || "Erreur de validation")
        return
      }

      toast.error(error instanceof Error ? error.message : "Impossible d'enregistrer le chauffeur")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="driver-first-name">Prénom</Label>
        <Input
          id="driver-first-name"
          value={form.firstName}
          onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver-last-name">Nom</Label>
        <Input
          id="driver-last-name"
          value={form.lastName}
          onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver-company-id">ID de l'entreprise</Label>
        <Input
          id="driver-company-id"
          value={form.companyId}
          onChange={(event) => setForm((prev) => ({ ...prev, companyId: event.target.value }))}
          placeholder="Ex: 1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver-signature-date">Date de signature EPI (ISO)</Label>
        <Input
          id="driver-signature-date"
          type="datetime-local"
          value={form.ppeSignatureDate}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              ppeSignatureDate: event.target.value
                ? new Date(event.target.value).toISOString()
                : "",
            }))
          }
        />
      </div>

      <div className="flex items-center gap-2 py-2">
        <Switch
          id="driver-ppe-valid"
          checked={form.ppeCharterValid}
          onCheckedChange={(checked) => setForm((prev) => ({ ...prev, ppeCharterValid: checked }))}
        />
        <Label htmlFor="driver-ppe-valid">Charte de sécurité (EPI) validée</Label>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={createDriver.isPending} className="w-full">
          {createDriver.isPending ? "Création..." : "Enregistrer le chauffeur"}
        </Button>
      </div>
    </form>
  )
}



