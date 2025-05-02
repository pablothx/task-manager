"use client"

import { NotesList } from "@/components/notes-list"
import { CreateNoteButton } from "@/components/create-note-button"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotesPage() {
  return (
    <main className="container max-w-md mx-auto px-4 py-6">
      <Navigation />

      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">TODO</TabsTrigger>
          <TabsTrigger value="idea">Ideas</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotesList />
        </TabsContent>
        <TabsContent value="todo">
          <NotesList category="todo" />
        </TabsContent>
        <TabsContent value="idea">
          <NotesList category="idea" />
        </TabsContent>
        <TabsContent value="meeting">
          <NotesList category="meeting" />
        </TabsContent>
        <TabsContent value="personal">
          <NotesList category="personal" />
        </TabsContent>
      </Tabs>

      <CreateNoteButton />
    </main>
  )
}
