"use client"

import { useState, useEffect } from "react"
import { NoteCard } from "@/components/note-card"
import type { Note } from "@/lib/types"
import { noteApi } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NotesListProps {
  category?: string
}

export function NotesList({ category }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    fetchNotes()
  }, [category])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError(null)

      let fetchedNotes: Note[]
      if (category) {
        fetchedNotes = await noteApi.getNotesByCategory(category)
      } else {
        fetchedNotes = await noteApi.getNotes()
      }

      setNotes(fetchedNotes)
    } catch (err) {
      setError("Error al cargar las notas. Por favor, intenta de nuevo.")
      console.error("Error fetching notes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      const updated = await noteApi.updateNote(updatedNote.id, updatedNote)
      setNotes(notes.map((note) => (note.id === updated.id ? updated : note)))
    } catch (err) {
      setError("Error al actualizar la nota.")
      console.error("Error updating note:", err)
    }
  }

  const handleNoteDelete = async (noteId: string) => {
    try {
      await noteApi.deleteNote(noteId)
      setNotes(notes.filter((note) => note.id !== noteId))
    } catch (err) {
      setError("Error al eliminar la nota.")
      console.error("Error deleting note:", err)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterCategory("all")
    setFilterPriority("all")
  }

  let filteredNotes = notes

  // Filter by category if specified in props
  if (category) {
    filteredNotes = filteredNotes.filter((note) => note.category === category)
  }

  // Apply search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
    filteredNotes = filteredNotes.filter(
      (note) => note.title.toLowerCase().includes(searchLower) || note.content.toLowerCase().includes(searchLower),
    )
  }

  // Apply category filter
  if (filterCategory !== "all") {
    filteredNotes = filteredNotes.filter((note) => note.category === filterCategory)
  }

  // Apply priority filter
  if (filterPriority !== "all") {
    filteredNotes = filteredNotes.filter((note) => note.priority === filterPriority)
  }

  const hasActiveFilters = searchTerm || filterCategory !== "all" || filterPriority !== "all"

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
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar notas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-32">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  <SelectItem value="todo">Pendiente</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="reminder">Recordatorio</SelectItem>
                  <SelectItem value="meeting">Reunión</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Prioridades</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              <X className="mr-2 h-3.5 w-3.5" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No se encontraron notas</div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onUpdate={handleNoteUpdate} onDelete={handleNoteDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
