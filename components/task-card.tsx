"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Task, User } from "@/lib/types"
import { taskApi, userApi } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle2, ChevronRight, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { TaskDialog } from "@/components/task-dialog"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { TaskDetailModal } from "@/components/task-detail-modal"

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
  index: number
}

// Array de colores para los bordes de las tarjetas
const borderColors = [
  "border-blue-400",
  "border-green-400",
  "border-purple-400",
  "border-orange-400",
  "border-pink-400",
  "border-teal-400",
  "border-indigo-400",
  "border-yellow-400",
  "border-red-400",
  "border-cyan-400",
]

export function TaskCard({ task, onUpdate, onDelete, index }: TaskCardProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swiping, setSwiping] = useState(false)
  const [assignedUser, setAssignedUser] = useState<User | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task>(task)
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Obtener color de borde basado en el índice
  const getBorderColor = () => {
    return borderColors[index % borderColors.length]
  }

  // Update current task when the task prop changes
  useEffect(() => {
    setCurrentTask(task)
  }, [task])

  useEffect(() => {
    // Fetch user data if task is assigned
    if (currentTask.assignedTo) {
      fetchAssignedUser(currentTask.assignedTo)
    } else {
      setAssignedUser(null)
    }
  }, [currentTask.assignedTo])

  const fetchAssignedUser = async (userId: string) => {
    try {
      const user = await userApi.getUser(userId)
      setAssignedUser(user)
    } catch (error) {
      console.error("Error fetching assigned user:", error)
      setAssignedUser(null)
    }
  }

  const handleComplete = async () => {
    try {
      setLoading(true)
      const updatedTask = await taskApi.updateTask(currentTask.id, {
        status: "done",
      })
      setCurrentTask(updatedTask)
      onUpdate(updatedTask)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteAlert(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      await taskApi.deleteTask(currentTask.id)
      onDelete(currentTask.id)
      setShowDeleteAlert(false)
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDialog(true)
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      setLoading(true)
      const savedTask = await taskApi.updateTask(updatedTask.id, updatedTask)
      setCurrentTask(savedTask)
      onUpdate(savedTask)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
    setTouchEnd(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)

    if (touchStart && touchEnd && cardRef.current) {
      const distance = touchEnd - touchStart

      // Only allow right swipe (positive distance)
      if (distance > 0) {
        const swipePercent = Math.min(distance / 200, 1)
        cardRef.current.style.transform = `translateX(${distance}px)`
        cardRef.current.style.opacity = `${1 - swipePercent * 0.5}`

        if (distance > 100) {
          setSwiping(true)
        } else {
          setSwiping(false)
        }
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchStart && touchEnd && cardRef.current) {
      const distance = touchEnd - touchStart

      if (distance > 100) {
        // Complete the swipe animation
        cardRef.current.style.transform = `translateX(100%)`
        cardRef.current.style.opacity = "0"

        // Mark task as done
        setTimeout(() => {
          handleComplete()
          // Reset the card style
          cardRef.current!.style.transform = ""
          cardRef.current!.style.opacity = ""
          setSwiping(false)
        }, 300)
      } else {
        // Reset the card position
        cardRef.current.style.transform = ""
        cardRef.current.style.opacity = ""
        setSwiping(false)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
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
            <ChevronRight className="h-3 w-3 mr-1" />
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
            <span className="text-xs font-medium text-priority-high">Prioridad Alta</span>
          </div>
        )
      case "medium":
        return (
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-priority-medium mr-1" />
            <span className="text-xs font-medium text-priority-medium">Prioridad Media</span>
          </div>
        )
      case "low":
        return (
          <div className="flex items-center">
            <Flag className="h-4 w-4 text-priority-low mr-1" />
            <span className="text-xs font-medium text-priority-low">Prioridad Baja</span>
          </div>
        )
      default:
        return null
    }
  }

  // Get card border color based on status
  const getCardBorderClass = () => {
    if (currentTask.status === "done") {
      return "border-l-4 border-l-status-done-border bg-status-done-bg/10"
    }
    if (currentTask.status === "in-progress") {
      return "border-l-4 border-l-status-in-progress-border bg-status-in-progress-bg/10"
    }
    if (currentTask.priority === "high") {
      return "border-l-4 border-l-priority-high"
    }
    return ""
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open the modal if clicking on action buttons
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest("button") || e.target.tagName === "BUTTON" || e.target.closest("a") || e.target.tagName === "A")
    ) {
      return
    }
    setShowDetailModal(true)
  }

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          "relative p-4 rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer",
          getBorderColor(),
          getCardBorderClass(),
          currentTask.status === "done" ? "bg-slate-50/50 dark:bg-slate-800/50" : "bg-white dark:bg-slate-900",
          loading ? "opacity-50 pointer-events-none" : "",
        )}
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {swiping && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-50 bg-opacity-80 rounded-lg z-10">
            <CheckCircle2 className="text-green-500 h-12 w-12" />
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3
              className={cn(
                "font-medium text-lg",
                currentTask.status === "done"
                  ? "line-through text-slate-500 dark:text-slate-400"
                  : "text-slate-900 dark:text-slate-100",
              )}
            >
              {currentTask.title}
            </h3>
          </div>
          <div className="ml-2">{getStatusBadge(currentTask.status)}</div>
        </div>

        {/* Priority Indicator */}
        <div className="mb-2">{getPriorityIndicator(currentTask.priority)}</div>

        {/* Description Section */}
        {currentTask.description && (
          <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
            <p
              className={cn(
                "text-sm line-clamp-2",
                currentTask.status === "done"
                  ? "line-through text-slate-400 dark:text-slate-500"
                  : "text-slate-700 dark:text-slate-300",
              )}
            >
              {currentTask.description}
            </p>
          </div>
        )}

        {/* Assigned User Section */}
        {assignedUser && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={assignedUser.avatar || undefined} alt={assignedUser.name} />
              <AvatarFallback>{assignedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Asignada a:</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{assignedUser.name}</p>
            </div>
          </div>
        )}

        {/* Image Section */}
        {currentTask.image && (
          <div className="mb-3 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
            <Image
              src={currentTask.image || "/placeholder.svg"}
              alt={currentTask.title}
              width={300}
              height={200}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Footer Section */}
        <div className="flex justify-end items-center pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Due Date */}
          <div className="flex items-center text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            <Clock className="h-3 w-3 mr-1 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300">
              {currentTask.dueDate
                ? formatDistanceToNow(new Date(currentTask.dueDate), { addSuffix: true })
                : "Sin fecha de vencimiento"}
            </span>
          </div>
        </div>

        {/* Swipe Indicator */}
        {currentTask.status !== "done" && (
          <div className="absolute right-2 inset-y-0 flex items-center text-slate-300 opacity-50">
            <ChevronRight className="h-6 w-6" />
          </div>
        )}
      </div>

      {showDialog && (
        <TaskDialog task={currentTask} open={showDialog} onOpenChange={setShowDialog} onSave={handleTaskUpdate} />
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
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showDetailModal && (
        <TaskDetailModal
          task={currentTask}
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          onUpdate={handleTaskUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
