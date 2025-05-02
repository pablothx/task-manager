"use client"

import { useTheme } from "@/components/theme-provider"
import { TaskCard as BaseTaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard(props: TaskCardProps) {
  const { theme } = useTheme()

  // If not using professional theme, use the base TaskCard
  if (theme !== "professional") {
    return <BaseTaskCard {...props} />
  }

  // Otherwise, use the professional-styled TaskCard
  return <BaseTaskCard {...props} />
}
