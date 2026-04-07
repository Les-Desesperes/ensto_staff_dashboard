import { CreateDriverForm } from "@/components/dashboard/livreurs/create-driver-form"
import { LivreursTable } from "@/components/dashboard/livreurs/livreurs-table"

export default function LivreursPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Livreurs & Autorisations</h2>
                <p className="text-muted-foreground">
                    Gérez les chauffeurs enregistrés et la validité de leurs chartes de sécurité (EPI).
                    Les données personnelles sont stockées de manière chiffrée.
                </p>
            </div>
            <CreateDriverForm />
            <LivreursTable />
        </div>
    )
}