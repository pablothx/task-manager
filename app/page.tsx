"use client"

import { useState } from "react"
import { TaskList } from "@/components/task-list"
import { CreateTaskButton } from "@/components/create-task-button"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"

export default function Home() {
  // In a real app, you would get the current user ID from authentication
  const [currentUserId, setCurrentUserId] = useState("1") // Assuming user 1 is logged in
  const { theme } = useTheme()

  const isProfessional = theme === "professional"

  return (
    <main className={`container max-w-md mx-auto px-4 py-6 ${isProfessional ? "professional-container" : ""}`}>
      <Navigation />

      <Tabs defaultValue="my-tasks" className="mb-6">
        <TabsList className={`grid w-full grid-cols-2 ${isProfessional ? "professional-tabs" : ""}`}>
          <TabsTrigger value="my-tasks">Mis Tareas</TabsTrigger>
          <TabsTrigger value="all-tasks">Todas las Tareas</TabsTrigger>
        </TabsList>
        <TabsContent value="my-tasks">
          <TaskList assignedToUserId={currentUserId} showFilter={true} />
        </TabsContent>
        <TabsContent value="all-tasks" id="all-tasks">
          <TaskList showFilter={true} />
        </TabsContent>
      </Tabs>

      <CreateTaskButton />
    </main>
  )
}
