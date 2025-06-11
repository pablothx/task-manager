"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UserCard } from "@/components/user-card"
import { UserForm } from "@/components/user-form"
import { TaskAssignment } from "@/components/task-assignment"
import { Plus, Home, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"
import { userApi } from "@/lib/api"
import { Navigation } from "@/components/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedUsers = await userApi.getUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      setError("Error al cargar los usuarios. Por favor, intenta de nuevo.")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSave = async (user: User) => {
    try {
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
    } catch (err) {
      setError("Error al guardar el usuario.")
      console.error("Error saving user:", err)
    }
  }

  const handleUserDelete = async (userId: string) => {
    try {
      await userApi.deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
    } catch (err) {
      setError("Error al eliminar el usuario.")
      console.error("Error deleting user:", err)
    }
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

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
