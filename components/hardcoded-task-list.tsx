"use client"

import { useState } from "react"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Tareas hardcodeadas de ejemplo
const hardcodedTasks: Task[] = [
  {
    id: "hc-1",
    title: "Diseñar nueva interfaz de usuario",
    description:
      "Crear mockups y prototipos para la nueva versión de la aplicación móvil. Incluir diseños para modo claro y oscuro.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 días
    image: null,
    assignedTo: "1",
  },
  {
    id: "hc-2",
    title: "Implementar sistema de notificaciones",
    description: "Desarrollar el backend y frontend para notificaciones push en tiempo real. Integrar con Firebase.",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 días
    image: null,
    assignedTo: "2",
  },
  {
    id: "hc-3",
    title: "Optimizar rendimiento de la base de datos",
    description: "Revisar y optimizar las consultas SQL más lentas. Implementar índices y cache donde sea necesario.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 días
    image: null,
    assignedTo: "3",
  },
  {
    id: "hc-4",
    title: "Escribir documentación técnica",
    description:
      "Documentar todas las APIs y endpoints. Crear guías de instalación y configuración para desarrolladores.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 días
    image: null,
    assignedTo: null,
  },
  {
    id: "hc-5",
    title: "Configurar pipeline de CI/CD",
    description:
      "Implementar integración continua con GitHub Actions. Configurar despliegue automático a staging y producción.",
    status: "done",
    priority: "high",
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Completada hace 2 días
    image: null,
    assignedTo: "1",
  },
  {
    id: "hc-6",
    title: "Realizar pruebas de seguridad",
    description:
      "Ejecutar auditoría de seguridad completa. Revisar vulnerabilidades y implementar correcciones necesarias.",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 días
    image: null,
    assignedTo: "2",
  },
  {
    id: "hc-7",
    title: "Actualizar dependencias del proyecto",
    description: "Revisar y actualizar todas las librerías y dependencias a sus versiones más recientes y seguras.",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 86400000 * 21).toISOString(), // 21 días
    image: null,
    assignedTo: null,
  },
  {
    id: "hc-8",
    title: "Implementar modo offline",
    description:
      "Desarrollar funcionalidad para que la app funcione sin conexión. Sincronizar datos cuando se recupere la conexión.",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 días
    image: null,
    assignedTo: "3",
  },
  {
    id: "hc-9",
    title: "Crear sistema de backup automático",
    description: "Implementar backups automáticos diarios de la base de datos con retención de 30 días.",
    status: "done",
    priority: "medium",
    dueDate: new Date(Date.now() - 86400000 * 5).toISOString(), // Completada hace 5 días
    image: null,
    assignedTo: "1",
  },
  {
    id: "hc-10",
    title: "Optimizar imágenes y assets",
    description: "Comprimir y optimizar todas las imágenes y recursos estáticos para mejorar los tiempos de carga.",
    status: "pending",
    priority: "low",
    dueDate: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 días
    image: null,
    assignedTo: null,
  },
]

export function HardcodedTaskList() {
  const [sortBy, setSortBy] = useState<string>("default")
  const [tasks] = useState<Task[]>(hardcodedTasks)

  // Función para ordenar las tareas
  const sortTasks = (tasksToSort: Task[]): Task[] => {
    switch (sortBy) {
      case "alphabetical":
        return [...tasksToSort].sort((a, b) => a.title.localeCompare(b.title))
      case "priority":
        const priorityOrder = { high: 1, medium: 2, low: 3 }
        return [...tasksToSort].sort(
          (a, b) =>
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder],
        )
      case "status":
        const statusOrder = { "in-progress": 1, pending: 2, done: 3 }
        return [...tasksToSort].sort(
          (a, b) =>
            statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder],
        )
      case "dueDate":
        return [...tasksToSort].sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
      default:
        return tasksToSort
    }
  }

  // Aplicar ordenamiento
  const sortedTasks = sortTasks(tasks)

  // Funciones dummy para las props requeridas del TaskCard
  const handleTaskUpdate = (updatedTask: Task) => {
    console.log("Tarea hardcoded actualizada (solo demo):", updatedTask)
    // En tareas hardcoded, no hacemos nada real
  }

  const handleTaskDelete = (taskId: string) => {
    console.log("Tarea hardcoded eliminada (solo demo):", taskId)
    // En tareas hardcoded, no hacemos nada real
  }

  // Estadísticas de las tareas
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
  }

  return (
    <div>
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Estas son tareas de ejemplo hardcodeadas. Los cambios aquí son solo para demostración y no se guardan.
        </AlertDescription>
      </Alert>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Total</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className="text-xs text-yellow-600 dark:text-yellow-400">Pendientes</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">En Progreso</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.done}</div>
          <div className="text-xs text-green-600 dark:text-green-400">Completadas</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.highPriority}</div>
          <div className="text-xs text-red-600 dark:text-red-400">Alta Prioridad</div>
        </div>
      </div>

      {/* Controles de ordenamiento */}
      <div className="flex justify-end mb-4">
        <div className="w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8">
              <ArrowDownUp className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Predeterminado</SelectItem>
              <SelectItem value="alphabetical">Alfabético</SelectItem>
              <SelectItem value="priority">Prioridad</SelectItem>
              <SelectItem value="status">Estado</SelectItem>
              <SelectItem value="dueDate">Fecha de Vencimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-6">
        {sortedTasks.map((task, index) => (
          <TaskCard key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} index={index} />
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h3 className="font-medium mb-2">Información sobre las Tareas Hardcoded</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Estas tareas están definidas directamente en el código</li>
          <li>• No se conectan a ninguna API o base de datos</li>
          <li>• Útiles para pruebas y demostraciones</li>
          <li>• Los cambios no se persisten al recargar la página</li>
          <li>• Incluyen ejemplos de diferentes estados y prioridades</li>
        </ul>
      </div>
    </div>
  )
}
