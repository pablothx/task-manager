"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/task-dialog"
import type { Task } from "@/lib/types"
import { taskApi } from "@/lib/api"

export function CreateTaskButton() {
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (task: Task) => {
    try {
      setLoading(true)
      // Create task via API
      const createdTask = await taskApi.createTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        image: task.image,
        assignedTo: task.assignedTo,
      })

      console.log("Nueva tarea creada:", createdTask)
      setShowDialog(false)

      // Refresh the page to show the new task
      window.location.reload()
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Crear nueva tarea"
        disabled={loading}
      >
        <Plus className="h-6 w-6" />
      </button>

      <TaskDialog open={showDialog} onOpenChange={setShowDialog} onSave={handleSave} />
    </>
  )
}
