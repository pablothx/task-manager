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
    console.log("New task created:", task)

    // Close the dialog
    setShowCreateDialog(false)

    // Notify parent component
    if (onTaskCreated) {
      onTaskCreated(task)
    }
  }

  return (
    <div className="flex items-center justify-between mb-6 bg-background border-b pb-4">
      <div className="flex items-center">
        <Link href="/" className="mr-2">
          <Button variant="ghost" size="icon" aria-label="Home">
            <Home className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Task Manager</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Link href="/notes">
          <Button variant="outline" size="icon" className="rounded-full" aria-label="Notes">
            <BookOpen className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="View all tasks"
          onClick={() =>
            window.scrollTo({ top: document.getElementById("all-tasks")?.offsetTop || 0, behavior: "smooth" })
          }
        >
          <ListTodo className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Create new task"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        {showAdminLink && (
          <Link href="/admin">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Admin dashboard">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
        )}
        <ThemeToggle />
      </div>
      <TaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSave={handleSave} />
    </div>
  )
}
