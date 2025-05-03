"use client"

import { ListTodo, Settings, BookOpen, Zap } from "lucide-react"
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
    <div className="flex items-center justify-between mb-6 bg-background border-b pb-4 w-full px-4 overflow-x-auto">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors">AxBoard</h1>
        </Link>
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
        {showAdminLink && (
          <Link href="/admin">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Panel de administración">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        )}
        <ThemeToggle />
        <Link href="/motivate-me">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-red-100 hover:bg-red-200 text-black border-red-500"
            aria-label="Motivación"
          >
            <Zap className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <TaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSave={handleSave} />
    </div>
  )
}
