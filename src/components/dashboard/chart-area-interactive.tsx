"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart for access logs"

// Données factices adaptées au projet ENSTO (Entrées et Sorties)
// Note: Le "desktop" devient "entrees" et "mobile" devient "sorties"
const chartData = [
  { date: "2024-04-01", entrees: 120, sorties: 118 },
  { date: "2024-04-02", entrees: 97, sorties: 95 },
  { date: "2024-04-03", entrees: 167, sorties: 160 },
  { date: "2024-04-04", entrees: 242, sorties: 240 },
  { date: "2024-04-05", entrees: 173, sorties: 170 },
  { date: "2024-04-06", entrees: 45, sorties: 45 }, // Week-end
  { date: "2024-04-07", entrees: 30, sorties: 30 }, // Week-end
  { date: "2024-04-08", entrees: 209, sorties: 205 },
  { date: "2024-04-09", entrees: 159, sorties: 155 },
  { date: "2024-04-10", entrees: 261, sorties: 260 },
  { date: "2024-04-11", entrees: 227, sorties: 225 },
  { date: "2024-04-12", entrees: 292, sorties: 290 },
  { date: "2024-04-13", entrees: 42, sorties: 42 }, // Week-end
  { date: "2024-04-14", entrees: 27, sorties: 27 }, // Week-end
  { date: "2024-04-15", entrees: 120, sorties: 119 },
  { date: "2024-04-16", entrees: 138, sorties: 135 },
  { date: "2024-04-17", entrees: 246, sorties: 240 },
  { date: "2024-04-18", entrees: 264, sorties: 260 },
  { date: "2024-04-19", entrees: 243, sorties: 240 },
  { date: "2024-04-20", entrees: 39, sorties: 39 }, // Week-end
  { date: "2024-04-21", entrees: 25, sorties: 25 }, // Week-end
  { date: "2024-04-22", entrees: 224, sorties: 220 },
  { date: "2024-04-23", entrees: 138, sorties: 135 },
  { date: "2024-04-24", entrees: 287, sorties: 285 },
  { date: "2024-04-25", entrees: 215, sorties: 210 },
  { date: "2024-04-26", entrees: 175, sorties: 170 },
  { date: "2024-04-27", entrees: 53, sorties: 53 }, // Week-end
  { date: "2024-04-28", entrees: 22, sorties: 22 }, // Week-end
  { date: "2024-04-29", entrees: 215, sorties: 210 },
  { date: "2024-04-30", entrees: 254, sorties: 250 },
  { date: "2024-05-01", entrees: 65, sorties: 65 },  // Férié
  { date: "2024-05-02", entrees: 293, sorties: 290 },
  { date: "2024-05-03", entrees: 247, sorties: 245 },
  { date: "2024-05-04", entrees: 85, sorties: 85 }, // Week-end
  { date: "2024-05-05", entrees: 41, sorties: 41 }, // Week-end
  { date: "2024-05-06", entrees: 298, sorties: 290 },
  { date: "2024-05-07", entrees: 288, sorties: 280 },
  { date: "2024-05-08", entrees: 49, sorties: 49 },  // Férié
  { date: "2024-05-09", entrees: 227, sorties: 225 },
  { date: "2024-05-10", entrees: 293, sorties: 290 },
  { date: "2024-05-11", entrees: 35, sorties: 35 }, // Week-end
  { date: "2024-05-12", entrees: 19, sorties: 19 }, // Week-end
  { date: "2024-05-13", entrees: 197, sorties: 195 },
  { date: "2024-05-14", entrees: 248, sorties: 245 },
  { date: "2024-05-15", entrees: 273, sorties: 270 },
  { date: "2024-05-16", entrees: 338, sorties: 335 },
  { date: "2024-05-17", entrees: 299, sorties: 290 },
  { date: "2024-05-18", entrees: 45, sorties: 45 }, // Week-end
  { date: "2024-05-19", entrees: 35, sorties: 35 }, // Week-end
  { date: "2024-05-20", entrees: 77, sorties: 77 },  // Férié
  { date: "2024-05-21", entrees: 282, sorties: 280 },
  { date: "2024-05-22", entrees: 281, sorties: 280 },
  { date: "2024-05-23", entrees: 252, sorties: 250 },
  { date: "2024-05-24", entrees: 294, sorties: 290 },
  { date: "2024-05-25", entrees: 51, sorties: 51 }, // Week-end
  { date: "2024-05-26", entrees: 23, sorties: 23 }, // Week-end
  { date: "2024-05-27", entrees: 220, sorties: 215 },
  { date: "2024-05-28", entrees: 233, sorties: 230 },
  { date: "2024-05-29", entrees: 178, sorties: 175 },
  { date: "2024-05-30", entrees: 240, sorties: 235 },
  { date: "2024-05-31", entrees: 178, sorties: 175 },
  { date: "2024-06-01", entrees: 48, sorties: 48 }, // Week-end
  { date: "2024-06-02", entrees: 30, sorties: 30 }, // Week-end
  { date: "2024-06-03", entrees: 203, sorties: 200 },
  { date: "2024-06-04", entrees: 239, sorties: 235 },
  { date: "2024-06-05", entrees: 188, sorties: 185 },
  { date: "2024-06-06", entrees: 294, sorties: 290 },
  { date: "2024-06-07", entrees: 223, sorties: 220 },
  { date: "2024-06-08", entrees: 65, sorties: 65 }, // Week-end
  { date: "2024-06-09", entrees: 38, sorties: 38 }, // Week-end
  { date: "2024-06-10", entrees: 155, sorties: 150 },
  { date: "2024-06-11", entrees: 192, sorties: 190 },
  { date: "2024-06-12", entrees: 292, sorties: 290 },
  { date: "2024-06-13", entrees: 181, sorties: 180 },
  { date: "2024-06-14", entrees: 226, sorties: 220 },
  { date: "2024-06-15", entrees: 47, sorties: 47 }, // Week-end
  { date: "2024-06-16", entrees: 31, sorties: 31 }, // Week-end
  { date: "2024-06-17", entrees: 275, sorties: 270 },
  { date: "2024-06-18", entrees: 207, sorties: 205 },
  { date: "2024-06-19", entrees: 241, sorties: 240 },
  { date: "2024-06-20", entrees: 308, sorties: 305 },
  { date: "2024-06-21", entrees: 169, sorties: 165 },
  { date: "2024-06-22", entrees: 57, sorties: 57 }, // Week-end
  { date: "2024-06-23", entrees: 40, sorties: 40 }, // Week-end
  { date: "2024-06-24", entrees: 132, sorties: 130 },
  { date: "2024-06-25", entrees: 141, sorties: 140 },
  { date: "2024-06-26", entrees: 234, sorties: 230 },
  { date: "2024-06-27", entrees: 248, sorties: 245 },
  { date: "2024-06-28", entrees: 149, sorties: 145 },
  { date: "2024-06-29", entrees: 43, sorties: 43 }, // Week-end
  { date: "2024-06-30", entrees: 26, sorties: 26 }, // Week-end
]

const chartConfig = {
  mouvements: {
    label: "Mouvements",
  },
  entrees: {
    label: "Entrées",
    color: "var(--primary)",
  },
  sorties: {
    label: "Sorties",
    color: "hsl(var(--destructive))", // On peut mettre une couleur différente (ex: rouge/orange) pour les sorties
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Historique des Accès (Site ENSTO)</CardTitle>
          <CardDescription>
          <span className="hidden @[540px]/card:block">
            Volume d'entrées et sorties sur les 3 derniers mois
          </span>
            <span className="@[540px]/card:hidden">Derniers 3 mois</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Sélectionner une période"
              >
                <SelectValue placeholder="3 derniers mois" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  3 derniers mois
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  30 derniers jours
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  7 derniers jours
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                {/* Dégradé pour les Entrées */}
                <linearGradient id="fillEntrees" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-entrees)"
                      stopOpacity={1.0}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-entrees)"
                      stopOpacity={0.1}
                  />
                </linearGradient>
                {/* Dégradé pour les Sorties */}
                <linearGradient id="fillSorties" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-sorties)"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-sorties)"
                      stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
              />
              <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("fr-FR", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })
                        }}
                        indicator="dot"
                    />
                  }
              />
              <Area
                  dataKey="sorties"
                  type="natural"
                  fill="url(#fillSorties)"
                  stroke="var(--color-sorties)"
                  stackId="a"
              />
              <Area
                  dataKey="entrees"
                  type="natural"
                  fill="url(#fillEntrees)"
                  stroke="var(--color-entrees)"
                  stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}