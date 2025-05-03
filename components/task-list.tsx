"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskFilter, type FilterOptions } from "@/components/task-filter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp } from "lucide-react"

interface TaskListProps {
  priority?: boolean
  showFilter?: boolean
  assignedToUserId?: string
}

export function TaskList({ priority = false, showFilter = false, assignedToUserId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    priority: "all",
    searchTerm: "",
  })
  const [sortBy, setSortBy] = useState<string>("default")

  useEffect(() => {
    // Simulate fetching tasks from an API
    setTimeout(() => {
      const demoTasks: Task[] = [
        {
          id: "1",
          title: "Completar propuesta de proyecto",
          description: "Terminar el borrador y enviar para revisión",
          status: "in-progress",
          priority: "high",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          image: null,
          assignedTo: "2",
        },
        {
          id: "2",
          title: "Reunión semanal de equipo",
          description: "Discutir el progreso del proyecto y los próximos pasos",
          status: "pending",
          priority: "high",
          dueDate: new Date(Date.now() + 172800000).toISOString(),
          image: null,
          assignedTo: null,
        },
        {
          id: "3",
          title: "Revisar comentarios del cliente",
          description: "Revisar los comentarios y preparar respuestas",
          status: "pending",
          priority: "medium",
          dueDate: new Date(Date.now() + 259200000).toISOString(),
          image: null,
          assignedTo: "1",
        },
        {
          id: "4",
          title: "Actualizar documentación",
          description: "Añadir cambios recientes a la documentación del proyecto",
          status: "pending",
          priority: "low",
          dueDate: new Date(Date.now() + 345600000).toISOString(),
          image: null,
          assignedTo: null,
        },
      ]

      setTasks(demoTasks)
      setLoading(false)
    }, 1000)
  }, [])

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
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

  // Filter by assigned user if specified
  if (assignedToUserId) {
    filteredTasks = filteredTasks.filter((task) => task.assignedTo === assignedToUserId)
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
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
