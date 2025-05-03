"use client"

import { useState, useEffect } from "react"
import type { Task, User } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, CheckCircle2, ArrowRightCircle, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TaskAssignmentProps {
  onAssignTask: (taskId: string, userId: string) => void
}

export function TaskAssignment({ onAssignTask }: TaskAssignmentProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching tasks and users from an API
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

      const demoUsers: User[] = [
        {
          id: "1",
          name: "Juan Pérez",
          email: "juan.perez@ejemplo.com",
          role: "admin",
          avatar: null,
          department: "Ingeniería",
          position: "Desarrollador Senior",
        },
        {
          id: "2",
          name: "María García",
          email: "maria.garcia@ejemplo.com",
          role: "manager",
          avatar: null,
          department: "Marketing",
          position: "Gerente de Marketing",
        },
        {
          id: "3",
          name: "Roberto Rodríguez",
          email: "roberto.rodriguez@ejemplo.com",
          role: "user",
          avatar: null,
          department: "Ventas",
          position: "Representante de Ventas",
        },
      ]

      setTasks(demoTasks)
      setUsers(demoUsers)
      setLoading(false)
    }, 1000)
  }, [])

  const handleAssignTask = (taskId: string, userId: string) => {
    // Update local state
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, assignedTo: userId === "unassigned" ? null : userId }
        }
        return task
      }),
    )

    // Call the parent handler
    onAssignTask(taskId, userId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-status-done-text" />
      case "in-progress":
        return <ArrowRightCircle className="h-4 w-4 text-status-in-progress-text" />
      case "pending":
        return <Clock className="h-4 w-4 text-status-pending-text" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Flag className="h-4 w-4 text-priority-high" />
      case "medium":
        return <Flag className="h-4 w-4 text-priority-medium" />
      case "low":
        return <Flag className="h-4 w-4 text-priority-low" />
      default:
        return <Flag className="h-4 w-4" />
    }
  }

  const getUserById = (userId: string | null) => {
    if (!userId) return null
    return users.find((user) => user.id === userId) || null
  }

  if (loading) {
    return <div className="text-center py-8">Cargando tareas y usuarios...</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div
                className={`w-2 md:w-2 ${
                  task.status === "done"
                    ? "bg-status-done-border"
                    : task.status === "in-progress"
                      ? "bg-status-in-progress-border"
                      : task.priority === "high"
                        ? "bg-priority-high"
                        : ""
                }`}
              ></div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(task.priority)}
                    <div className="text-xs">
                      {task.dueDate && (
                        <span>Vence {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Asignada a:</span>
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={getUserById(task.assignedTo)?.avatar || undefined} />
                          <AvatarFallback>{getUserById(task.assignedTo)?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{getUserById(task.assignedTo)?.name}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Sin asignar
                      </Badge>
                    )}
                  </div>

                  <Select
                    value={task.assignedTo || "unassigned"}
                    onValueChange={(value) => handleAssignTask(task.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Asignar a..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
