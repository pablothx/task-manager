"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskFilter, type FilterOptions } from "@/components/task-filter"

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

  useEffect(() => {
    // Simulate fetching tasks from an API
    setTimeout(() => {
      const demoTasks: Task[] = [
        {
          id: "1",
          title: "Complete project proposal",
          description: "Finish the draft and send for review",
          status: "in-progress",
          priority: "high",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          image: null,
          assignedTo: "2",
        },
        {
          id: "2",
          title: "Weekly team meeting",
          description: "Discuss project progress and next steps",
          status: "pending",
          priority: "high",
          dueDate: new Date(Date.now() + 172800000).toISOString(),
          image: null,
          assignedTo: null,
        },
        {
          id: "3",
          title: "Review client feedback",
          description: "Go through comments and prepare responses",
          status: "pending",
          priority: "medium",
          dueDate: new Date(Date.now() + 259200000).toISOString(),
          image: null,
          assignedTo: "1",
        },
        {
          id: "4",
          title: "Update documentation",
          description: "Add recent changes to the project documentation",
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
      {showFilter && <TaskFilter onFilterChange={setFilters} />}

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {assignedToUserId ? "No tasks assigned to you" : priority ? "No priority tasks" : "No tasks found"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
