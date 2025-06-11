"use client"

import type React from "react"

import { useState } from "react"
import type { Note } from "@/lib/types"
import { noteApi } from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NoteFormProps {
  note?: Note
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (note: Note) => void
}

export function NoteForm({ note, open, onOpenChange, onSave }: NoteFormProps) {
  const isNewNote = !note
  const router = useRouter()

  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [category, setCategory] = useState(note?.category || "todo")
  const [priority, setPriority] = useState(note?.priority || "medium")
  const [showCancelAlert, setShowCancelAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const noteData = {
        title,
        content,
        category,
        priority,
      }

      let savedNote: Note
      if (isNewNote) {
        savedNote = await noteApi.createNote(noteData)
      } else {
        savedNote = await noteApi.updateNote(note!.id, noteData)
      }

      onSave(savedNote)
      onOpenChange(false)
    } catch (err) {
      setError(isNewNote ? "Error al crear la nota." : "Error al actualizar la nota.")
      console.error("Error saving note:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowCancelAlert(true)
  }

  const confirmCancel = () => {
    setShowCancelAlert(false)
    onOpenChange(false)
    // Redirect to notes list
    router.push("/notes")
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isNewNote ? "Crear Nueva Nota" : "Editar Nota"}</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la nota"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Pendiente</SelectItem>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="reminder">Recordatorio</SelectItem>
                    <SelectItem value="meeting">Reunión</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridad</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <Flag className="h-4 w-4 text-priority-low mr-2" />
                        Baja
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <Flag className="h-4 w-4 text-priority-medium mr-2" />
                        Media
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center">
                        <Flag className="h-4 w-4 text-priority-high mr-2" />
                        Alta
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu nota aquí..."
                rows={8}
                required
              />
            </div>

            <DialogFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : isNewNote ? "Crear Nota" : "Guardar Cambios"}
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
