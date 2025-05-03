"use client"

import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function AppFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t py-2 px-4 flex justify-center">
      <Link
        href="/ayuda"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        ¿Necesitas ayuda?
      </Link>
    </footer>
  )
}
