"use client"

import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, Flag, ListTodo, BookOpen, Zap, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AyudaPage() {
  return (
    <main className="container max-w-3xl mx-auto px-4 py-6">
      <Navigation showAdminLink={false} />

      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Documentación de AxBoard</h1>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Bienvenido a AxBoard</h2>
        <p>
          AxBoard es una aplicación de gestión de tareas diseñada específicamente para dispositivos móviles. Te permite
          organizar tus tareas, tomar notas y mantenerte motivado, todo desde una interfaz intuitiva y fácil de usar.
        </p>

        <h2>Características principales</h2>

        <h3>Gestión de tareas</h3>
        <p>
          La función principal de AxBoard es ayudarte a gestionar tus tareas diarias. Puedes crear, editar, organizar y
          completar tareas desde cualquier lugar.
        </p>
        <ul>
          <li>
            <strong>Crear tareas:</strong> Toca en cualquier tarea para ver sus detalles o editarla.
          </li>
          <li>
            <strong>Completar tareas:</strong> Desliza una tarea hacia la derecha para marcarla como completada.
          </li>
          <li>
            <strong>Prioridades:</strong> Asigna prioridades a tus tareas (Alta{" "}
            <Flag className="inline h-3 w-3 text-priority-high" />, Media{" "}
            <Flag className="inline h-3 w-3 text-priority-medium" />, Baja{" "}
            <Flag className="inline h-3 w-3 text-priority-low" />
            ).
          </li>
          <li>
            <strong>Estados:</strong> Las tareas pueden estar en diferentes estados:
            <ul>
              <li>
                Pendiente <Clock className="inline h-3 w-3" />
              </li>
              <li>
                En Progreso <ArrowLeft className="inline h-3 w-3" />
              </li>
              <li>
                Completada <CheckCircle2 className="inline h-3 w-3" />
              </li>
            </ul>
          </li>
          <li>
            <strong>Ordenamiento:</strong> Puedes ordenar tus tareas alfabéticamente o por prioridad.
          </li>
        </ul>

        <h3>Notas</h3>
        <p>
          Además de las tareas, AxBoard te permite crear y organizar notas para capturar ideas, recordatorios o
          cualquier información importante.
        </p>
        <ul>
          <li>
            <strong>Categorías:</strong> Organiza tus notas en diferentes categorías (Pendientes, Ideas, Recordatorios,
            Reuniones, Personal).
          </li>
          <li>
            <strong>Prioridades:</strong> Asigna prioridades a tus notas para destacar las más importantes.
          </li>
        </ul>

        <h3>Motivación</h3>
        <p>
          ¿Te sientes estancado? AxBoard incluye una función de motivación que te proporciona frases inspiradoras para
          ayudarte a mantener el enfoque y la productividad.
        </p>
        <ul>
          <li>
            Accede a esta función tocando el botón <Zap className="inline h-3 w-3" /> en la barra de navegación.
          </li>
          <li>Toca "Inspírame" para recibir una frase motivacional aleatoria.</li>
        </ul>

        <h3>Panel de administración</h3>
        <p>
          El panel de administración te permite gestionar usuarios y asignar tareas a diferentes miembros del equipo.
        </p>
        <ul>
          <li>
            Accede al panel tocando el botón <Settings className="inline h-3 w-3" /> en la barra de navegación.
          </li>
          <li>Gestiona usuarios: añade, edita o elimina usuarios.</li>
          <li>Asigna tareas a usuarios específicos.</li>
        </ul>

        <h2>Navegación</h2>
        <p>La barra de navegación superior te permite acceder a las diferentes secciones de la aplicación:</p>
        <ul>
          <li>
            <strong>AxBoard:</strong> Toca el título para volver a la página principal.
          </li>
          <li>
            <strong>
              Notas <BookOpen className="inline h-3 w-3" />:
            </strong>{" "}
            Accede a tus notas.
          </li>
          <li>
            <strong>
              Tareas <ListTodo className="inline h-3 w-3" />:
            </strong>{" "}
            Ver todas tus tareas.
          </li>
          <li>
            <strong>
              Administración <Settings className="inline h-3 w-3" />:
            </strong>{" "}
            Accede al panel de administración.
          </li>
          <li>
            <strong>
              Motivación <Zap className="inline h-3 w-3" />:
            </strong>{" "}
            Recibe frases motivacionales.
          </li>
        </ul>

        <h2>Personalización</h2>
        <p>AxBoard ofrece diferentes temas para personalizar la apariencia de la aplicación según tus preferencias:</p>
        <ul>
          <li>
            <strong>Claro:</strong> Tema claro para uso diurno.
          </li>
          <li>
            <strong>Oscuro:</strong> Tema oscuro para reducir la fatiga visual en entornos con poca luz.
          </li>
          <li>
            <strong>Profesional:</strong> Tema con estilo profesional para entornos de trabajo.
          </li>
          <li>
            <strong>Sistema:</strong> Sigue la configuración de tu dispositivo.
          </li>
        </ul>

        <h2>Consejos de uso</h2>
        <ul>
          <li>
            <strong>Desliza para completar:</strong> Desliza una tarea hacia la derecha para marcarla como completada
            rápidamente.
          </li>
          <li>
            <strong>Toca para detalles:</strong> Toca cualquier tarea o nota para ver todos sus detalles.
          </li>
          <li>
            <strong>Usa filtros:</strong> Utiliza los filtros para encontrar rápidamente las tareas que necesitas.
          </li>
          <li>
            <strong>Asigna prioridades:</strong> Utiliza las prioridades para destacar las tareas más importantes.
          </li>
        </ul>

        <h2>Soporte</h2>
        <p>Si tienes alguna pregunta o problema con AxBoard, no dudes en contactar con nuestro equipo de soporte:</p>
        <ul>
          <li>Correo electrónico: soporte@axboard.com</li>
          <li>Sitio web: www.axboard.com/soporte</li>
        </ul>

        <p className="mt-8 text-center text-sm text-muted-foreground">AxBoard © 2023 - Todos los derechos reservados</p>
      </div>
    </main>
  )
}
