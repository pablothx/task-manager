"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { NoteForm } from "@/components/note-form"
import type { Note } from "@/lib/types"
import { useRouter } from "next/navigation"

export function CreateNoteButton() {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const handleSave = (note: Note) => {
    // In a real app, you would save this to your backend
    console.log("New note created:", note)

    // Close the dialog
    setShowDialog(false)

    // Refresh the note list (in a real app)
    // This would trigger a refetch or update the state
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Create new note"
      >
        <Plus className="h-6 w-6" />
      </button>

      <NoteForm open={showDialog} onOpenChange={setShowDialog} onSave={handleSave} />
    </>
  )
}
