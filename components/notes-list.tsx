"use client"

import { useState, useEffect } from "react"
import { NoteCard } from "@/components/note-card"
import type { Note } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface NotesListProps {
  category?: string
}

export function NotesList({ category }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  useEffect(() => {
    // Simulate fetching notes from an API
    setTimeout(() => {
      const demoNotes: Note[] = [
        {
          id: "1",
          title: "Project ideas for Q3",
          content: "1. Mobile app redesign\n2. API performance optimization\n3. New dashboard features",
          category: "idea",
          priority: "high",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "2",
          title: "Weekly team meeting agenda",
          content: "- Project status updates\n- Blockers discussion\n- Planning for next sprint",
          category: "meeting",
          priority: "medium",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "3",
          title: "Follow up with clients",
          content: "Need to contact:\n- ABC Corp about contract renewal\n- XYZ Inc about new requirements",
          category: "todo",
          priority: "high",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Personal development goals",
          content: "1. Complete React advanced course\n2. Read 'Clean Code'\n3. Practice TypeScript daily",
          category: "personal",
          priority: "low",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ]

      setNotes(demoNotes)
      setLoading(false)
    }, 1000)
  }, [])

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
  }

  const handleNoteDelete = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
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

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
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
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="todo">TODO</SelectItem>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              <X className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No notes found</div>
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
