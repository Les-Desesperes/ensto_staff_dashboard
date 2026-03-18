import { SecuriteSettings } from "@/components/dashboard/securite/securite-settings"

export default function SecuritePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col space-y-2 mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Sécurité & Accès</h2>
                <p className="text-muted-foreground">
                    Supervision globale de l'infrastructure cryptographique, des règles de hachage et des accès à l'API.
                </p>
            </div>

            <SecuriteSettings />
        </div>
    )
}