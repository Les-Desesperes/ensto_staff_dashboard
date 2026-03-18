import { VisiteursTable } from "@/components/dashboard/visiteurs/visiteurs-table"

export default function VisiteursPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Visiteurs Temporaires</h2>
                <p className="text-muted-foreground">
                    Gestion des intervenants extérieurs (maintenance, audits, rendez-vous).
                    Leurs données sont chiffrées selon notre politique RGPD.
                </p>
            </div>
            <VisiteursTable />
        </div>
    )
}