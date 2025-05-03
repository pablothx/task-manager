"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, Search, X } from "lucide-react"

export type FilterOptions = {
  status: string
  priority: string
  searchTerm: string
}

interface TaskFilterProps {
  onFilterChange: (filters: FilterOptions) => void
}

export function TaskFilter({ onFilterChange }: TaskFilterProps) {
  const [status, setStatus] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFilterChange({ status: value, priority, searchTerm })
  }

  const handlePriorityChange = (value: string) => {
    setPriority(value)
    onFilterChange({ status, priority: value, searchTerm })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    onFilterChange({ status, priority, searchTerm: e.target.value })
  }

  const clearFilters = () => {
    setStatus("all")
    setPriority("all")
    setSearchTerm("")
    onFilterChange({ status: "all", priority: "all", searchTerm: "" })
  }

  const hasActiveFilters = status !== "all" || priority !== "all" || searchTerm !== ""

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar tareas..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
                <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pendiente</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">En Progreso</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="done">Completado</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Prioridad
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup value={priority} onValueChange={handlePriorityChange}>
                <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">Baja</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">Media</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">Alta</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="mr-2 h-3.5 w-3.5" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
