"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity, Truck, ShieldCheck, Building2, TrendingUpIcon } from "lucide-react"

export function SectionCards() {
  return (
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">

        {/* Carte 1 : Traçabilité (Table Historique_Log) */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Mouvements du jour</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              142
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                <Activity className="size-3 mr-1" />
                En direct
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Activité normale sur site
            </div>
            <div className="text-muted-foreground">
              Entrées et sorties enregistrées aujourd'hui
            </div>
          </CardFooter>
        </Card>

        {/* Carte 2 : Volume Livreurs (Table Livreur) */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Livreurs Enregistrés</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              856
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUpIcon className="size-3 mr-1" />
                +12
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Nouveaux chauffeurs ce mois-ci
            </div>
            <div className="text-muted-foreground">
              Base de données active
            </div>
          </CardFooter>
        </Card>

        {/* Carte 3 : Sécurité (Champ charte_epi_valide) */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Conformité EPI</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              94%
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                À surveiller
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Chartes de sécurité validées <ShieldCheck className="size-4 text-primary" />
            </div>
            <div className="text-muted-foreground">6% de livreurs non-conformes</div>
          </CardFooter>
        </Card>

        {/* Carte 4 : Partenaires (Table Entreprise) */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Entreprises Partenaires</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              42
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Building2 className="size-3 mr-1" />
                Actif
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Transporteurs réguliers <Truck className="size-4" />
            </div>
            <div className="text-muted-foreground">Sociétés enregistrées dans le système</div>
          </CardFooter>
        </Card>

      </div>
  )
}