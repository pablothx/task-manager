"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Array de frases motivacionales en español
const frasesMotivacionales = [
  "Tú puedes con esto. Empieza poco a poco, pero empieza ahora.",
  "La única forma de hacer un gran trabajo es amar lo que haces.",
  "Cree que puedes y ya estás a medio camino.",
  "No mires el reloj; haz lo que hace. Sigue adelante.",
  "El éxito no es definitivo, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
  "El futuro pertenece a quienes creen en la belleza de sus sueños.",
  "Siempre parece imposible hasta que se hace.",
  "Tu tiempo es limitado, no lo desperdicies viviendo la vida de otra persona.",
  "La mejor manera de predecir el futuro es crearlo.",
  "No dejes que el ayer ocupe demasiado del hoy.",
]

export default function MotivateMePage() {
  const [loading, setLoading] = useState(false)
  const [frase, setFrase] = useState<string | null>(null)
  const [mostrarFrase, setMostrarFrase] = useState(false)

  const obtenerFraseAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * frasesMotivacionales.length)
    return frasesMotivacionales[indiceAleatorio]
  }

  const handleClickInspirar = () => {
    setLoading(true)
    setMostrarFrase(false)

    // Simular llamada a API
    setTimeout(() => {
      setFrase(obtenerFraseAleatoria())
      setLoading(false)
      setMostrarFrase(true)
    }, 1500)
  }

  return (
    <main className="container max-w-md mx-auto px-4 py-6">
      <Navigation />

      <div className="flex flex-col items-center justify-center mt-8 text-center">
        <h1 className="text-3xl font-bold mb-4">¿Te sientes estancado? ¡Vamos a motivarte! 💪</h1>

        <p className="text-muted-foreground mb-8">Toca el botón para recibir un impulso motivacional rápido.</p>

        <div className="w-full flex justify-end mb-8">
          <Button
            onClick={handleClickInspirar}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-black hover:from-red-600 hover:to-gray-900 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Rocket className="h-5 w-5 mr-2" />}
            Inspírame
          </Button>
        </div>

        {mostrarFrase && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full mt-4"
          >
            <Card className="bg-gradient-to-br from-red-50 to-gray-50 border-red-200 shadow-md">
              <CardContent className="p-6">
                <p className="text-xl font-medium text-gray-800 italic">"{frase}"</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  )
}
