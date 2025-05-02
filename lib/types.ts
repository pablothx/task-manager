export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string | null
  department: string
  position: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
  image: string | null
  assignedTo: string | null // User ID
}

export interface Note {
  id: string
  title: string
  content: string
  category: string // 'Idea', 'TODO', etc.
  priority: string
  createdAt: string
  updatedAt: string
}
