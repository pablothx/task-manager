"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/task-dialog"
import type { Task } from "@/lib/types"
import { useRouter } from "next/navigation"

export function CreateTaskButton() {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const handleSave = (task: Task) => {
    // In a real app, you would save this to your backend
    console.log("Nueva tarea creada:", task)

    // Close the dialog
    setShowDialog(false)

    // Refresh the task list (in a real app)
    // This would trigger a refetch or update the state

    // Redirect to the task list
    router.push("#all-tasks")
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Crear nueva tarea"
      >
        <Plus className="h-6 w-6" />
      </button>

      <TaskDialog open={showDialog} onOpenChange={setShowDialog} onSave={handleSave} />
    </>
  )
}
