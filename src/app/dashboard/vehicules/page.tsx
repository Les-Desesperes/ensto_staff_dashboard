import { VehiculesTable } from "@/components/dashboard/vehicules/vehicules-table"

export default function VehiculesPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Flotte de Véhicules</h2>
                <p className="text-muted-foreground">
                    Répertoire des plaques d'immatriculation associées aux livreurs pour le contrôle d'accès aux barrières.
                </p>
            </div>
            <VehiculesTable />
        </div>
    )
}