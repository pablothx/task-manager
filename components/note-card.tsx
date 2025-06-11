"use client"

import { useState } from "react"
import type { Note } from "@/lib/types"
import { noteApi } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Flag, Calendar } from "lucide-react"
import { format } from "date-fns"
import { NoteForm } from "@/components/note-form"
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

interface NoteCardProps {
  note: Note
  onUpdate: (note: Note) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [loading, setLoading] = useState(false)

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "todo":
        return <Badge className="bg-blue-500">Pendiente</Badge>
      case "idea":
        return <Badge className="bg-purple-500">Idea</Badge>
      case "reminder":
        return <Badge className="bg-yellow-500">Recordatorio</Badge>
      case "meeting":
        return <Badge className="bg-green-500">Reunión</Badge>
      case "personal":
        return <Badge className="bg-pink-500">Personal</Badge>
      default:
        return <Badge>{category}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-priority-high"
      case "medium":
        return "text-priority-medium"
      case "low":
        return "text-priority-low"
      default:
        return ""
    }
  }

  const handleDelete = () => {
    setShowDeleteAlert(true)
  }

  const confirmDelete = async () => {
    try {
      setLoading(true)
      await noteApi.deleteNote(note.id)
      onDelete(note.id)
      setShowDeleteAlert(false)
    } catch (error) {
      console.error("Error deleting note:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      setLoading(true)
      const savedNote = await noteApi.updateNote(updatedNote.id, updatedNote)
      onUpdate(savedNote)
      setShowEditDialog(false)
    } catch (error) {
      console.error("Error updating note:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card
        className={`border-l-4 ${
          note.priority === "high"
            ? "border-l-priority-high"
            : note.priority === "medium"
              ? "border-l-priority-medium"
              : "border-l-priority-low"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{note.title}</h3>
            <div className="flex items-center gap-2">
              {getCategoryBadge(note.category)}
              <Flag className={`h-4 w-4 ${getPriorityColor(note.priority)}`} />
            </div>
          </div>

          <div className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</div>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t flex justify-between items-center bg-muted/20">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(note.createdAt), "d MMM, yyyy")}
          </div>

          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(true)} disabled={loading}>
              <Edit className="h-3.5 w-3.5 mr-1" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500" onClick={handleDelete} disabled={loading}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </Button>
          </div>
        </CardFooter>
      </Card>

      <NoteForm note={note} open={showEditDialog} onOpenChange={setShowEditDialog} onSave={handleNoteUpdate} />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta nota?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la nota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
