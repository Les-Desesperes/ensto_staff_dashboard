import { EntreprisesTable } from "@/components/dashboard/entreprises/entreprises-table"

export default function EntreprisesPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Entreprises Partenaires</h2>
                <p className="text-muted-foreground">
                    Répertoire des sociétés de transport et des prestataires externes autorisés sur le site.
                </p>
            </div>
            <EntreprisesTable />
        </div>
    )
}