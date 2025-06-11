"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"
import { taskApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskFilter, type FilterOptions } from "@/components/task-filter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TaskListProps {
  priority?: boolean
  showFilter?: boolean
  assignedToUserId?: string
}

export function TaskList({ priority = false, showFilter = false, assignedToUserId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    priority: "all",
    searchTerm: "",
  })
  const [sortBy, setSortBy] = useState<string>("default")

  useEffect(() => {
    fetchTasks()
  }, [assignedToUserId])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      let fetchedTasks: Task[]
      if (assignedToUserId) {
        fetchedTasks = await taskApi.getTasksByUser(assignedToUserId)
      } else {
        fetchedTasks = await taskApi.getTasks()
      }

      setTasks(fetchedTasks)
    } catch (err) {
      setError("Error al cargar las tareas. Por favor, intenta de nuevo.")
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const updated = await taskApi.updateTask(updatedTask.id, updatedTask)
      setTasks(tasks.map((task) => (task.id === updated.id ? updated : task)))
    } catch (err) {
      setError("Error al actualizar la tarea.")
      console.error("Error updating task:", err)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId)
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (err) {
      setError("Error al eliminar la tarea.")
      console.error("Error deleting task:", err)
    }
  }

  // Función para ordenar las tareas
  const sortTasks = (tasksToSort: Task[]): Task[] => {
    switch (sortBy) {
      case "alphabetical":
        return [...tasksToSort].sort((a, b) => a.title.localeCompare(b.title))
      case "priority":
        const priorityOrder = { high: 1, medium: 2, low: 3 }
        return [...tasksToSort].sort(
          (a, b) =>
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder],
        )
      default:
        return tasksToSort
    }
  }

  let filteredTasks = tasks

  // Filter by priority if needed
  if (priority) {
    filteredTasks = filteredTasks.filter((task) => task.priority === "high")
  }

  // Apply additional filters if showFilter is true
  if (showFilter) {
    if (filters.status !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === filters.status)
    }

    if (filters.priority !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority)
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower),
      )
    }
  }

  // Aplicar ordenamiento
  filteredTasks = sortTasks(filteredTasks)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg border">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-4">
        {showFilter && <TaskFilter onFilterChange={setFilters} />}

        <div className="flex justify-end mb-2">
          <div className="w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8">
                <ArrowDownUp className="h-3.5 w-3.5 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Predeterminado</SelectItem>
                <SelectItem value="alphabetical">Alfabético</SelectItem>
                <SelectItem value="priority">Prioridad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {assignedToUserId
            ? "No hay tareas asignadas a ti"
            : priority
              ? "No hay tareas prioritarias"
              : "No se encontraron tareas"}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
