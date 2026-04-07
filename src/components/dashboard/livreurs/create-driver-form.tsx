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

export function CreateDriverForm() {
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
      toast.success("Driver created successfully")
      setForm(initialState)
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message || "Validation error")
        return
      }

      toast.error(error instanceof Error ? error.message : "Unable to create driver")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Driver (API mutation example)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="driver-first-name">First name</Label>
            <Input
              id="driver-first-name"
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-last-name">Last name</Label>
            <Input
              id="driver-last-name"
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-company-id">Company ID</Label>
            <Input
              id="driver-company-id"
              value={form.companyId}
              onChange={(event) => setForm((prev) => ({ ...prev, companyId: event.target.value }))}
              placeholder="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver-signature-date">PPE signature date (ISO)</Label>
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

          <div className="flex items-center gap-2 md:col-span-2">
            <Switch
              id="driver-ppe-valid"
              checked={form.ppeCharterValid}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, ppeCharterValid: checked }))}
            />
            <Label htmlFor="driver-ppe-valid">PPE charter valid</Label>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={createDriver.isPending}>
              {createDriver.isPending ? "Creating..." : "Create Driver"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

