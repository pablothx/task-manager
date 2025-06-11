"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { NoteForm } from "@/components/note-form"
import type { Note } from "@/lib/types"
import { noteApi } from "@/lib/api"

export function CreateNoteButton() {
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (note: Note) => {
    try {
      setLoading(true)
      // Create note via API
      const createdNote = await noteApi.createNote({
        title: note.title,
        content: note.content,
        category: note.category,
        priority: note.priority,
      })

      console.log("Nueva nota creada:", createdNote)
      setShowDialog(false)

      // Refresh the page to show the new note
      window.location.reload()
    } catch (error) {
      console.error("Error creating note:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Crear nueva nota"
        disabled={loading}
      >
        <Plus className="h-6 w-6" />
      </button>

      <NoteForm open={showDialog} onOpenChange={setShowDialog} onSave={handleSave} />
    </>
  )
}
