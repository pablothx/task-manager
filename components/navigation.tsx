"use client"

import { ListTodo, Plus, Settings, Home, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { TaskDialog } from "@/components/task-dialog"
import { useState } from "react"
import type { Task } from "@/lib/types"
import Link from "next/link"

interface NavigationProps {
  onTaskCreated?: (task: Task) => void
  showAdminLink?: boolean
}

export function Navigation({ onTaskCreated, showAdminLink = true }: NavigationProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleSave = (task: Task) => {
    // In a real app, you would save this to your backend
    console.log("Nueva tarea creada:", task)

    // Close the dialog
    setShowCreateDialog(false)

    // Notify parent component
    if (onTaskCreated) {
      onTaskCreated(task)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6 bg-background border-b pb-4 w-full px-4">
      <div className="flex items-center">
        <Link href="/" className="mr-2">
          <Button variant="ghost" size="icon" aria-label="Inicio">
            <Home className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">AxBoard</h1>
      </div>
      <div className="flex items-center space-x-3">
        <Link href="/notes">
          <Button variant="outline" size="icon" className="rounded-full" aria-label="Notas">
            <BookOpen className="h-6 w-6" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Ver todas las tareas"
          onClick={() =>
            window.scrollTo({ top: document.getElementById("all-tasks")?.offsetTop || 0, behavior: "smooth" })
          }
        >
          <ListTodo className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Crear nueva tarea"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
        {showAdminLink && (
          <Link href="/admin">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Panel de administración">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        )}
        <ThemeToggle />
      </div>
      <TaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSave={handleSave} />
    </div>
  )
}
