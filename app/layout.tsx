import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./professional-theme.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppFooter } from "@/components/app-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AxBoard",
  description: "Una aplicación de gestión de tareas adaptada para móviles",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="pb-12">
            {children}
            <AppFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
