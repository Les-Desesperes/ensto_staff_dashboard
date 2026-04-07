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
import { useDriversQuery } from "@/hooks/api/use-drivers-query"
import { useHistoryLogsQuery } from "@/hooks/api/use-history-logs-query"
import { useCompaniesQuery } from "@/hooks/api/use-companies-query"

export function SectionCards() {
  const { data: drivers = [] } = useDriversQuery()
  const { data: logs = [] } = useHistoryLogsQuery()
  const { data: companies = [] } = useCompaniesQuery()

  const validPpeRate = drivers.length === 0
    ? 0
    : Math.round((drivers.filter((driver) => driver.ppeCharterValid).length / drivers.length) * 100)

  return (
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Mouvements du jour</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {logs.length}
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
              Activite normale sur site
            </div>
            <div className="text-muted-foreground">
              Entrees et sorties enregistrees
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Livreurs Enregistres</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {drivers.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUpIcon className="size-3 mr-1" />
                API
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Base de chauffeurs synchronisee
            </div>
            <div className="text-muted-foreground">
              Source: /api/v1/driver/
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Conformite EPI</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {validPpeRate}%
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                A surveiller
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Chartes de securite validees <ShieldCheck className="size-4 text-primary" />
            </div>
            <div className="text-muted-foreground">{drivers.length - drivers.filter((driver) => driver.ppeCharterValid).length} livreur(s) non conformes</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Entreprises Partenaires</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {companies.length}
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
              Transporteurs reguliers <Truck className="size-4" />
            </div>
            <div className="text-muted-foreground">Sociétés enregistrees dans le systeme</div>
          </CardFooter>
        </Card>

      </div>
  )
}