const API_BASE_URL = "http://localhost:8080"

// Mock data for fallback
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Completar propuesta de proyecto",
    description: "Terminar el borrador y enviar para revisión",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    image: null,
    assignedTo: "2",
  },
  {
    id: "2",
    title: "Reunión semanal de equipo",
    description: "Discutir el progreso del proyecto y los próximos pasos",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    image: null,
    assignedTo: null,
  },
  {
    id: "3",
    title: "Revisar comentarios del cliente",
    description: "Revisar los comentarios y preparar respuestas",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    image: null,
    assignedTo: "1",
  },
  {
    id: "4",
    title: "Actualizar documentación",
    description: "Añadir cambios recientes a la documentación del proyecto",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 345600000).toISOString(),
    image: null,
    assignedTo: null,
  },
]

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Ideas para el nuevo proyecto",
    content: "Implementar sistema de notificaciones push\nMejorar la interfaz de usuario\nAñadir modo oscuro",
    category: "idea",
    priority: "high",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    title: "Reunión con el cliente",
    content: "Revisar los requisitos del proyecto\nDiscutir el cronograma\nDefinir entregables",
    category: "meeting",
    priority: "medium",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "3",
    title: "Tareas pendientes",
    content: "Comprar materiales de oficina\nProgramar mantenimiento del servidor\nActualizar documentación",
    category: "todo",
    priority: "low",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
]

const mockUsers: User[] = [
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

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  console.log(`Making API request: ${options.method || "GET"} ${url}`)

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`API response received:`, data)
    return data
  } catch (error) {
    console.warn(`API request failed for ${url}:`, error)
    throw error
  }
}

// Simulate API delay for realistic experience
const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Generate unique ID for new items
const generateId = () => Math.random().toString(36).substr(2, 9)

// Task API functions
export const taskApi = {
  // GET all tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      return await apiRequest<Task[]>("/api/tasks", {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getTasks")
      await simulateDelay()
      return [...mockTasks]
    }
  },

  // GET tasks by user ID
  getTasksByUser: async (userId: string): Promise<Task[]> => {
    try {
      return await apiRequest<Task[]>(`/api/tasks/user/${userId}`, {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getTasksByUser")
      await simulateDelay()
      return mockTasks.filter((task) => task.assignedTo === userId)
    }
  },

  // GET task by ID
  getTask: async (id: string): Promise<Task> => {
    try {
      return await apiRequest<Task>(`/api/tasks/${id}`, {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getTask")
      await simulateDelay()
      const task = mockTasks.find((t) => t.id === id)
      if (!task) throw new Error("Task not found")
      return task
    }
  },

  // POST - Create new task
  createTask: async (taskData: Omit<Task, "id">): Promise<Task> => {
    try {
      console.log("Creating task with data:", taskData)
      return await apiRequest<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      })
    } catch {
      console.log("Using mock data for createTask")
      await simulateDelay()
      const newTask: Task = {
        ...taskData,
        id: generateId(),
      }
      mockTasks.push(newTask)
      console.log("Mock task created:", newTask)
      return newTask
    }
  },

  // PUT - Update task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      console.log("Updating task:", id, "with data:", taskData)
      return await apiRequest<Task>(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
      })
    } catch {
      console.log("Using mock data for updateTask")
      await simulateDelay()
      const taskIndex = mockTasks.findIndex((t) => t.id === id)
      if (taskIndex === -1) throw new Error("Task not found")

      const updatedTask = { ...mockTasks[taskIndex], ...taskData }
      mockTasks[taskIndex] = updatedTask
      console.log("Mock task updated:", updatedTask)
      return updatedTask
    }
  },

  // DELETE task
  deleteTask: async (id: string): Promise<void> => {
    try {
      console.log("Deleting task:", id)
      await apiRequest<void>(`/api/tasks/${id}`, {
        method: "DELETE",
      })
      console.log("Task deleted successfully")
    } catch {
      console.log("Using mock data for deleteTask")
      await simulateDelay()
      const taskIndex = mockTasks.findIndex((t) => t.id === id)
      if (taskIndex === -1) throw new Error("Task not found")
      const deletedTask = mockTasks.splice(taskIndex, 1)[0]
      console.log("Mock task deleted:", deletedTask)
    }
  },

  // PATCH - Assign task to user
  assignTask: async (taskId: string, userId: string | null): Promise<Task> => {
    try {
      console.log("Assigning task:", taskId, "to user:", userId)
      return await apiRequest<Task>(`/api/tasks/${taskId}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ assignedTo: userId }),
      })
    } catch {
      console.log("Using mock data for assignTask")
      await simulateDelay()
      const taskIndex = mockTasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) throw new Error("Task not found")

      const updatedTask = { ...mockTasks[taskIndex], assignedTo: userId }
      mockTasks[taskIndex] = updatedTask
      console.log("Mock task assigned:", updatedTask)
      return updatedTask
    }
  },

  // PUT - Update task status
  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    try {
      console.log("Updating task status:", id, "to:", status)
      return await apiRequest<Task>(`/api/tasks/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      })
    } catch {
      console.log("Using mock data for updateTaskStatus")
      await simulateDelay()
      const taskIndex = mockTasks.findIndex((t) => t.id === id)
      if (taskIndex === -1) throw new Error("Task not found")

      const updatedTask = { ...mockTasks[taskIndex], status }
      mockTasks[taskIndex] = updatedTask
      console.log("Mock task status updated:", updatedTask)
      return updatedTask
    }
  },
}

// Note API functions
export const noteApi = {
  // GET all notes
  getNotes: async (): Promise<Note[]> => {
    try {
      return await apiRequest<Note[]>("/api/notes", {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getNotes")
      await simulateDelay()
      return [...mockNotes]
    }
  },

  // GET notes by category
  getNotesByCategory: async (category: string): Promise<Note[]> => {
    try {
      return await apiRequest<Note[]>(`/api/notes/category/${category}`, {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getNotesByCategory")
      await simulateDelay()
      return mockNotes.filter((note) => note.category === category)
    }
  },

  // GET note by ID
  getNote: async (id: string): Promise<Note> => {
    try {
      return await apiRequest<Note>(`/api/notes/${id}`, {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getNote")
      await simulateDelay()
      const note = mockNotes.find((n) => n.id === id)
      if (!note) throw new Error("Note not found")
      return note
    }
  },

  // POST - Create new note
  createNote: async (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
    try {
      console.log("Creating note with data:", noteData)
      return await apiRequest<Note>("/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData),
      })
    } catch {
      console.log("Using mock data for createNote")
      await simulateDelay()
      const now = new Date().toISOString()
      const newNote: Note = {
        ...noteData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      }
      mockNotes.push(newNote)
      console.log("Mock note created:", newNote)
      return newNote
    }
  },

  // PUT - Update note
  updateNote: async (id: string, noteData: Partial<Note>): Promise<Note> => {
    try {
      console.log("Updating note:", id, "with data:", noteData)
      return await apiRequest<Note>(`/api/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...noteData,
          updatedAt: new Date().toISOString(),
        }),
      })
    } catch {
      console.log("Using mock data for updateNote")
      await simulateDelay()
      const noteIndex = mockNotes.findIndex((n) => n.id === id)
      if (noteIndex === -1) throw new Error("Note not found")

      const updatedNote = {
        ...mockNotes[noteIndex],
        ...noteData,
        updatedAt: new Date().toISOString(),
      }
      mockNotes[noteIndex] = updatedNote
      console.log("Mock note updated:", updatedNote)
      return updatedNote
    }
  },

  // DELETE note
  deleteNote: async (id: string): Promise<void> => {
    try {
      console.log("Deleting note:", id)
      await apiRequest<void>(`/api/notes/${id}`, {
        method: "DELETE",
      })
      console.log("Note deleted successfully")
    } catch {
      console.log("Using mock data for deleteNote")
      await simulateDelay()
      const noteIndex = mockNotes.findIndex((n) => n.id === id)
      if (noteIndex === -1) throw new Error("Note not found")
      const deletedNote = mockNotes.splice(noteIndex, 1)[0]
      console.log("Mock note deleted:", deletedNote)
    }
  },

  // PUT - Update note category
  updateNoteCategory: async (id: string, category: string): Promise<Note> => {
    try {
      console.log("Updating note category:", id, "to:", category)
      return await apiRequest<Note>(`/api/notes/${id}/category`, {
        method: "PUT",
        body: JSON.stringify({ category }),
      })
    } catch {
      console.log("Using mock data for updateNoteCategory")
      await simulateDelay()
      const noteIndex = mockNotes.findIndex((n) => n.id === id)
      if (noteIndex === -1) throw new Error("Note not found")

      const updatedNote = {
        ...mockNotes[noteIndex],
        category,
        updatedAt: new Date().toISOString(),
      }
      mockNotes[noteIndex] = updatedNote
      console.log("Mock note category updated:", updatedNote)
      return updatedNote
    }
  },
}

// User API functions
export const userApi = {
  // GET all users
  getUsers: async (): Promise<User[]> => {
    try {
      return await apiRequest<User[]>("/api/users", {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getUsers")
      await simulateDelay()
      return [...mockUsers]
    }
  },

  // GET user by ID
  getUser: async (id: string): Promise<User> => {
    try {
      return await apiRequest<User>(`/api/users/${id}`, {
        method: "GET",
      })
    } catch {
      console.log("Using mock data for getUser")
      await simulateDelay()
      const user = mockUsers.find((u) => u.id === id)
      if (!user) throw new Error("User not found")
      return user
    }
  },

  // POST - Create new user
  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    try {
      console.log("Creating user with data:", userData)
      return await apiRequest<User>("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      })
    } catch {
      console.log("Using mock data for createUser")
      await simulateDelay()
      const newUser: User = {
        ...userData,
        id: generateId(),
      }
      mockUsers.push(newUser)
      console.log("Mock user created:", newUser)
      return newUser
    }
  },

  // PUT - Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      console.log("Updating user:", id, "with data:", userData)
      return await apiRequest<User>(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
    } catch {
      console.log("Using mock data for updateUser")
      await simulateDelay()
      const userIndex = mockUsers.findIndex((u) => u.id === id)
      if (userIndex === -1) throw new Error("User not found")

      const updatedUser = { ...mockUsers[userIndex], ...userData }
      mockUsers[userIndex] = updatedUser
      console.log("Mock user updated:", updatedUser)
      return updatedUser
    }
  },

  // DELETE user
  deleteUser: async (id: string): Promise<void> => {
    try {
      console.log("Deleting user:", id)
      await apiRequest<void>(`/api/users/${id}`, {
        method: "DELETE",
      })
      console.log("User deleted successfully")
    } catch {
      console.log("Using mock data for deleteUser")
      await simulateDelay()
      const userIndex = mockUsers.findIndex((u) => u.id === id)
      if (userIndex === -1) throw new Error("User not found")
      const deletedUser = mockUsers.splice(userIndex, 1)[0]
      console.log("Mock user deleted:", deletedUser)
    }
  },

  // PUT - Update user role
  updateUserRole: async (id: string, role: string): Promise<User> => {
    try {
      console.log("Updating user role:", id, "to:", role)
      return await apiRequest<User>(`/api/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      })
    } catch {
      console.log("Using mock data for updateUserRole")
      await simulateDelay()
      const userIndex = mockUsers.findIndex((u) => u.id === id)
      if (userIndex === -1) throw new Error("User not found")

      const updatedUser = { ...mockUsers[userIndex], role }
      mockUsers[userIndex] = updatedUser
      console.log("Mock user role updated:", updatedUser)
      return updatedUser
    }
  },
}

// Import types
import type { Task, Note, User } from "./types"
