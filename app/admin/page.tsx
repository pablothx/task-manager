"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UserCard } from "@/components/user-card"
import { UserForm } from "@/components/user-form"
import { TaskAssignment } from "@/components/task-assignment"
import { Plus, Home } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"
import { Navigation } from "@/components/navigation"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching users from an API
    setTimeout(() => {
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
      setLoading(false)
    }, 1000)
  }, [])

  const handleUserSave = (user: User) => {
    // Check if user already exists
    const existingUserIndex = users.findIndex((u) => u.id === user.id)

    if (existingUserIndex >= 0) {
      // Update existing user
      const updatedUsers = [...users]
      updatedUsers[existingUserIndex] = user
      setUsers(updatedUsers)
    } else {
      // Add new user
      setUsers([...users, user])
    }

    setShowUserForm(false)
  }

  const handleUserDelete = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleAssignTask = (taskId: string, userId: string) => {
    // In a real app, you would update this in your backend
    console.log(`Tarea ${taskId} asignada al usuario ${userId}`)
  }

  return (
    <main className="container max-w-4xl mx-auto px-4 py-6">
      <Navigation showAdminLink={false} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="tasks">Asignación de Tareas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Usuarios</h2>
            <Button onClick={() => setShowUserForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Usuario
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando usuarios...</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {users.map((user) => (
                <UserCard key={user.id} user={user} onUpdate={handleUserSave} onDelete={handleUserDelete} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Asignación de Tareas</h2>
            <p className="text-muted-foreground mb-4">
              Asigna tareas a los usuarios seleccionando del menú desplegable.
            </p>

            <TaskAssignment onAssignTask={handleAssignTask} />
          </div>
        </TabsContent>
      </Tabs>

      <UserForm open={showUserForm} onOpenChange={setShowUserForm} onSave={handleUserSave} />
    </main>
  )
}
