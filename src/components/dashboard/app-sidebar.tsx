"use client"

import * as React from "react"

import { NavAdmin } from "@/components/dashboard/nav-admin"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  CommandIcon,
  Logs,
  Users,
  TruckIcon,
  Building2Icon,
  CarFrontIcon,
  ContactIcon,
  ShieldCheckIcon
} from "lucide-react"
import { site } from "@/config/site"

const data = {
  // J'ai mis des données d'exemple pour le profil admin
  user: {
    name: "Admin ENSTO",
    email: "admin@ensto.fr",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Historique & Logs",
      url: "/dashboard/logs",
      icon: <Logs />,
    },
    {
      title: "Livreurs",
      url: "/dashboard/livreurs",
      icon: <TruckIcon />,
    },
    {
      title: "Véhicules",
      url: "/dashboard/vehicules",
      icon: <CarFrontIcon />,
    },
    {
      title: "Entreprises",
      url: "/dashboard/entreprises",
      icon: <Building2Icon />,
    },
    {
      title: "Visiteurs",
      url: "/dashboard/visiteurs",
      icon: <ContactIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Aide",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Rechercher",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  administration: [
    {
      name: "Gestion du Personnel",
      url: "/dashboard/users",
      icon: <Users />,
    },
    {
      name: "Sécurité & Accès",
      url: "/dashboard/securite",
      icon: <ShieldCheckIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <a href="/dashboard">
                  <CommandIcon className="size-5!" />
                  <span className="text-base font-semibold">{site.name || "ENSTO"}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* Navigation Principale (Métier) */}
          <NavMain items={data.navMain} />
          {/* Navigation Administration (Personnel) */}
          <NavAdmin items={data.administration} />
          {/* Navigation Secondaire (Paramètres, Aide) */}
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
  )
}