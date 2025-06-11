"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Loader2, Sparkles, Star, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

// Componente para las partículas de explosión
const ExplosionParticle = ({ delay, angle, distance }: { delay: number; angle: number; distance: number }) => {
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance

  return (
    <motion.div
      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
      animate={{
        x: [0, x, x * 1.5],
        y: [0, y, y * 1.5],
        scale: [0, 1, 0],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  )
}

// Componente para las estrellas brillantes
const SparkleEffect = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute"
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.5, 0],
        rotate: [0, 180, 360],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: "easeInOut",
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    >
      <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
    </motion.div>
  )
}

export default function MotivateMePage() {
  const [loading, setLoading] = useState(false)
  const [frase, setFrase] = useState<string | null>(null)
  const [mostrarFrase, setMostrarFrase] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)

  const obtenerFraseAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * frasesMotivacionales.length)
    return frasesMotivacionales[indiceAleatorio]
  }

  const handleClickInspirar = () => {
    setLoading(true)
    setMostrarFrase(false)
    setShowExplosion(false)

    // Simular llamada a API
    setTimeout(() => {
      setFrase(obtenerFraseAleatoria())
      setLoading(false)
      setShowExplosion(true)

      // Mostrar la frase después de la explosión
      setTimeout(() => {
        setMostrarFrase(true)
        setShowExplosion(false)
      }, 1000)
    }, 1500)
  }

  // Generar partículas para la explosión
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: i * 18 * (Math.PI / 180), // 360 grados dividido en 20 partículas
    distance: 100 + Math.random() * 50,
    delay: Math.random() * 0.3,
  }))

  // Generar estrellas brillantes
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
  }))

  return (
    <main className="container max-w-md mx-auto px-4 py-6">
      <Navigation />

      <div className="flex flex-col items-center justify-center mt-8 text-center relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-4">¿Te sientes estancado? ¡Vamos a motivarte! 💪</h1>

        <p className="text-muted-foreground mb-8">Toca el botón para recibir un impulso motivacional rápido.</p>

        <div className="w-full flex justify-end mb-8 relative">
          <Button
            onClick={handleClickInspirar}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-black hover:from-red-600 hover:to-gray-900 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all relative z-10"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Rocket className="h-5 w-5 mr-2" />}
            Inspírame
          </Button>

          {/* Efecto de explosión */}
          <AnimatePresence>
            {showExplosion && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Explosión central */}
                <motion.div
                  className="absolute w-20 h-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 3, 5], opacity: [1, 0.8, 0] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Onda de choque */}
                <motion.div
                  className="absolute w-32 h-32 border-4 border-yellow-400 rounded-full"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 4], opacity: [1, 0] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Partículas de explosión */}
                {particles.map((particle) => (
                  <ExplosionParticle
                    key={particle.id}
                    delay={particle.delay}
                    angle={particle.angle}
                    distance={particle.distance}
                  />
                ))}

                {/* Efectos de chispas */}
                {sparkles.map((sparkle) => (
                  <SparkleEffect key={sparkle.id} delay={sparkle.delay} />
                ))}

                {/* Rayos de luz */}
                <motion.div
                  className="absolute"
                  initial={{ scale: 0, rotate: 0, opacity: 0 }}
                  animate={{ scale: [0, 2], rotate: [0, 360], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <Zap className="h-16 w-16 text-yellow-300" />
                </motion.div>

                {/* Destellos adicionales */}
                <motion.div
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Sparkles className="h-12 w-12 text-white" />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Frase motivacional con animación */}
        <AnimatePresence>
          {mostrarFrase && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="w-full mt-4"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                    "0 0 40px rgba(255, 215, 0, 0.6)",
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Card className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-red-200 shadow-lg relative overflow-hidden">
                  {/* Efecto de brillo de fondo */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />

                  <CardContent className="p-6 relative z-10">
                    <motion.p
                      className="text-xl font-medium text-gray-800 italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      "{frase}"
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
