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
  ShieldCheckIcon,
} from "lucide-react"

import { useAuth } from "@/components/providers/auth-provider"
import { site } from "@/config/site"

const data = {
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
  const { user, isAuthenticated } = useAuth()

  const profile = {
    name: user?.username ?? "Guest",
    email: isAuthenticated ? `${user?.role ?? "Personnel"}` : "Not authenticated",
    avatar: "/avatars/admin.jpg",
  }

  const adminItems = user?.role === "Admin" ? data.administration : []

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
        <NavMain items={data.navMain} />
        {adminItems.length > 0 ? <NavAdmin items={adminItems} /> : null}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>
    </Sidebar>
  )
}