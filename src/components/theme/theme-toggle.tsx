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

export function ThemeButton({ className, variant, showText }: { className?: string, variant?: "outline" | "default" | "ghost", showText?: boolean }) {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const currentTheme = theme === "system" ? resolvedTheme : theme
    const nextTheme = currentTheme === "light" ? "dark" : "light"

    return (
        <Button
            type="button"
            onClick={() => setTheme(nextTheme)}
            className={className}
            variant={variant}
            aria-label={`Switch to ${nextTheme} mode`}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            {showText && (
                <span className="ml-2 text-sm">
                    {nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}
                </span>
            )}
            {!showText && <span className="sr-only">Switch to {nextTheme} mode</span>}
        </Button>
    )
}
