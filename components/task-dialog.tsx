"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Task, User } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X, Upload, CheckCircle, ArrowRightCircle, Flag, Clock } from "lucide-react"
import Image from "next/image"
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
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskDialogProps {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Task) => void
}

export function TaskDialog({ task, open, onOpenChange, onSave }: TaskDialogProps) {
  const isNewTask = !task
  const router = useRouter()

  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [status, setStatus] = useState(task?.status || "pending")
  const [priority, setPriority] = useState(task?.priority || "medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate ? new Date(task.dueDate) : undefined)
  const [image, setImage] = useState<string | null>(task?.image || null)
  const [assignedTo, setAssignedTo] = useState<string | null>(task?.assignedTo || null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [showCancelAlert, setShowCancelAlert] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset form state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setStatus(task.status || "pending")
      setPriority(task.priority || "medium")
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
      setImage(task.image || null)
      setAssignedTo(task.assignedTo || null)
    }
  }, [task])

  useEffect(() => {
    // Simulate fetching users from an API
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
    setUsers(demoUsers)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedTask: Task = {
      id: task?.id || Date.now().toString(),
      title,
      description,
      status,
      priority,
      dueDate: dueDate?.toISOString() || null,
      image,
      assignedTo,
    }

    onSave(updatedTask)
    onOpenChange(false) // Close the dialog after saving
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCancel = () => {
    if (
      isNewTask ||
      title !== task?.title ||
      description !== task?.description ||
      status !== task?.status ||
      priority !== task?.priority ||
      dueDate?.toISOString() !== task?.dueDate ||
      image !== task?.image ||
      assignedTo !== task?.assignedTo
    ) {
      setShowCancelAlert(true)
    } else {
      onOpenChange(false)
    }
  }

  const confirmCancel = () => {
    setShowCancelAlert(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewTask ? "Crear Nueva Tarea" : "Editar Tarea"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la tarea"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la tarea"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={status === "pending" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    status === "pending"
                      ? "bg-status-pending-bg text-status-pending-text border-2 border-status-pending-border"
                      : ""
                  }`}
                  onClick={() => setStatus("pending")}
                >
                  <Clock
                    className={`h-6 w-6 mb-1 ${status === "pending" ? "text-status-pending-text" : "text-slate-500"}`}
                  />
                  <span className="text-xs">Pendiente</span>
                </Button>
                <Button
                  type="button"
                  variant={status === "in-progress" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    status === "in-progress"
                      ? "bg-status-in-progress-bg text-status-in-progress-text border-2 border-status-in-progress-border"
                      : ""
                  }`}
                  onClick={() => setStatus("in-progress")}
                >
                  <ArrowRightCircle
                    className={`h-6 w-6 mb-1 ${status === "in-progress" ? "text-status-in-progress-text" : "text-blue-500"}`}
                  />
                  <span className="text-xs">En Progreso</span>
                </Button>
                <Button
                  type="button"
                  variant={status === "done" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    status === "done"
                      ? "bg-status-done-bg text-status-done-text border-2 border-status-done-border"
                      : ""
                  }`}
                  onClick={() => setStatus("done")}
                >
                  <CheckCircle
                    className={`h-6 w-6 mb-1 ${status === "done" ? "text-status-done-text" : "text-green-500"}`}
                  />
                  <span className="text-xs">Completada</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prioridad</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={priority === "low" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    priority === "low" ? "bg-priority-low/10 text-priority-low border-2 border-priority-low" : ""
                  }`}
                  onClick={() => setPriority("low")}
                >
                  <Flag className={`h-6 w-6 mb-1 ${priority === "low" ? "text-priority-low" : "text-priority-low"}`} />
                  <span className="text-xs">Baja</span>
                </Button>
                <Button
                  type="button"
                  variant={priority === "medium" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    priority === "medium"
                      ? "bg-priority-medium/10 text-priority-medium border-2 border-priority-medium"
                      : ""
                  }`}
                  onClick={() => setPriority("medium")}
                >
                  <Flag
                    className={`h-6 w-6 mb-1 ${priority === "medium" ? "text-priority-medium" : "text-priority-medium"}`}
                  />
                  <span className="text-xs">Media</span>
                </Button>
                <Button
                  type="button"
                  variant={priority === "high" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center h-20 ${
                    priority === "high" ? "bg-priority-high/10 text-priority-high border-2 border-priority-high" : ""
                  }`}
                  onClick={() => setPriority("high")}
                >
                  <Flag
                    className={`h-6 w-6 mb-1 ${priority === "high" ? "text-priority-high" : "text-priority-high"}`}
                  />
                  <span className="text-xs">Alta</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Asignada a</Label>
              <Select value={assignedTo || ""} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha de vencimiento</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Seleccionar una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date)
                      setCalendarOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Imagen (Opcional)</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Imagen
                </Button>
                {image && (
                  <Button type="button" variant="outline" onClick={handleRemoveImage} size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {image && (
                <div className="mt-2 relative rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt="Imagen de la tarea"
                    width={300}
                    height={200}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="professional:bg-gradient-to-b professional:from-primary professional:to-primary/90"
              >
                {isNewTask ? "Crear Tarea" : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres cancelar?</AlertDialogTitle>
            <AlertDialogDescription>Se perderán todos los cambios no guardados.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Sí, cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
