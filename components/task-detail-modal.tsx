"use client"

import { useState, useEffect } from "react"
import type { Task, User } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle2, ArrowRightCircle, Flag, Edit, Trash2, X } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskDialog } from "@/components/task-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskDetailModalProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskDetailModal({ task, open, onOpenChange, onUpdate, onDelete }: TaskDetailModalProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [assignedUser, setAssignedUser] = useState<User | null>(null)
  const [currentTask, setCurrentTask] = useState<Task>(task)

  // Update current task when the task prop changes
  useEffect(() => {
    setCurrentTask(task)
  }, [task])

  // Simulate fetching user data
  useEffect(() => {
    if (currentTask.assignedTo) {
      // In a real app, you would fetch this from your API
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

      const user = demoUsers.find((u) => u.id === currentTask.assignedTo)
      setAssignedUser(user || null)
    } else {
      setAssignedUser(null)
    }
  }, [currentTask.assignedTo])

  const handleEditClick = () => {
    setShowEditDialog(true)
  }

  const handleDeleteClick = () => {
    setShowDeleteAlert(true)
  }

  const handleConfirmDelete = () => {
    onDelete(currentTask.id)
    setShowDeleteAlert(false)
    onOpenChange(false)
  }

  const handleMarkAsDone = () => {
    const updatedTask = {
      ...currentTask,
      status: "done",
    }
    setCurrentTask(updatedTask)
    onUpdate(updatedTask)
  }

  const handleMarkAsInProgress = () => {
    const updatedTask = {
      ...currentTask,
      status: "in-progress",
    }
    setCurrentTask(updatedTask)
    onUpdate(updatedTask)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setCurrentTask(updatedTask)
    onUpdate(updatedTask)
    setShowEditDialog(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done":
        return (
          <Badge variant="outline" className="bg-status-done-bg text-status-done-text border-status-done-border">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        )
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-status-in-progress-bg text-status-in-progress-text border-status-in-progress-border"
          >
            <ArrowRightCircle className="h-3 w-3 mr-1" />
            En Progreso
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-status-pending-bg text-status-pending-text border-status-pending-border"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-priority-high mr-1" />
            <span className="text-sm font-medium text-priority-high">Prioridad Alta</span>
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-priority-medium mr-1" />
            <span className="text-sm font-medium text-priority-medium">Prioridad Media</span>
          </div>
        )
      case "low":
        return (
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-priority-low mr-1" />
            <span className="text-sm font-medium text-priority-low">Prioridad Baja</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
          <div className="max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-6 pb-2 sticky top-0 bg-background z-10">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-xl font-bold">{currentTask.title}</DialogTitle>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(currentTask.status)}
                  <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-2">
              <div className="mb-4">{getPriorityIndicator(currentTask.priority)}</div>

              {/* Description Section */}
              {currentTask.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Descripción</h3>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 professional:bg-white/50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{currentTask.description}</p>
                  </div>
                </div>
              )}

              {/* Assigned User Section */}
              {assignedUser && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Asignada a</h3>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 professional:bg-blue-50/50 rounded-md flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={assignedUser.avatar || undefined} alt={assignedUser.name} />
                      <AvatarFallback>{assignedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{assignedUser.name}</p>
                      <p className="text-sm text-muted-foreground">{assignedUser.position}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Section */}
              {currentTask.image && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Adjunto</h3>
                  <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                    <Image
                      src={currentTask.image || "/placeholder.svg"}
                      alt={currentTask.title}
                      width={500}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Due Date */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Fecha de vencimiento</h3>
                <div className="flex items-center px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 professional:bg-white/50">
                  <Clock className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                  <span>
                    {currentTask.dueDate
                      ? formatDistanceToNow(new Date(currentTask.dueDate), { addSuffix: true })
                      : "Sin fecha de vencimiento"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-4 border-t border-slate-200 dark:border-slate-700 professional:bg-slate-50/50 sticky bottom-0 bg-background">
              <div className="flex space-x-2 w-full sm:w-auto justify-start">
                <Button variant="outline" size="sm" onClick={handleEditClick}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-500" onClick={handleDeleteClick}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Eliminar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                {currentTask.status !== "done" && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleMarkAsDone}>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Marcar como Completada
                  </Button>
                )}
                {currentTask.status === "pending" && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleMarkAsInProgress}>
                    <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />
                    Iniciar Tarea
                  </Button>
                )}
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <TaskDialog
          task={currentTask}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSave={handleTaskUpdate}
        />
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea y sus datos de nuestros
              servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
