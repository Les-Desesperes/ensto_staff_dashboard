import { InteractiveLogsTable } from "@/components/dashboard/logs/logs-table";

export default function LogsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* En-tête de la page */}
            <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Traçabilité & Historique</h2>
                <p className="text-muted-foreground">
                    Consultez l'ensemble des événements du site ENSTO. Conformément à la norme, ces accès sont chiffrés et conservés pour une durée légale de 5 ans.
                </p>
            </div>

            {/* Conteneur de la table */}
            <div className="w-full">
                <InteractiveLogsTable />
            </div>
        </div>
    )
}