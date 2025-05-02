"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Mail } from "lucide-react"
import Image from "next/image"
import { UserForm } from "@/components/user-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserCardProps {
  user: User
  onUpdate: (user: User) => void
  onDelete: (id: string) => void
}

export function UserCard({ user, onUpdate, onDelete }: UserCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "user":
        return <Badge className="bg-green-500">User</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-24 w-full md:w-24 md:h-auto">
              <Image
                src={user.avatar || "/placeholder.svg?height=96&width=96"}
                alt={user.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    {user.email}
                  </div>
                </div>
                <div>{getRoleBadge(user.role)}</div>
              </div>

              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{user.department || "Not assigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium">{user.position || "Not assigned"}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500" onClick={() => setShowDeleteAlert(true)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserForm user={user} open={showEditDialog} onOpenChange={setShowEditDialog} onSave={onUpdate} />

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(user.id)} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
