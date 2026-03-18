"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeDropdown() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const ThemeButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & { showText?: boolean }
>(({ className, showText, ...props }, ref) => {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Évite les erreurs d'hydratation entre le serveur et le client
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const currentTheme = theme === "system" ? resolvedTheme : theme
    const isDark = currentTheme === "dark"

    return (
        <button
            ref={ref}
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={className}
            {...props}
        >
            {/* Le conteneur "relative" superpose les icônes pour ne pas casser l'alignement flex */}
            <div className="relative flex size-4 items-center justify-center">
                <Sun className="absolute size-4 scale-100 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute size-4 scale-0 transition-all dark:scale-100 dark:rotate-0" />
            </div>

            {showText && (
                <span>
          {mounted ? (isDark ? "Mode clair" : "Mode sombre") : "Thème"}
        </span>
            )}
        </button>
    )
})
ThemeButton.displayName = "ThemeButton"