"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Clock, CheckCircle2, Trash2, HeartPulse, Pill, Stethoscope } from "lucide-react"
import { TimePickerDemo } from "@/components/time-picker"
import NavBar from "@/components/nav-bar"
import EmergencyButton from "@/components/emergency-button"
import UserProfile from "@/components/user-profile"
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

interface Task {
  id: string
  title: string
  time: string
  completed: boolean
  assignedTo?: string
  icon?: string
}

interface FamilyMember {
  id: string
  name: string
  avatar: string
  available: boolean
  careResponsibility?: boolean
  careNote?: string
}

export default function HomePage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Give Grandma heart medication",
      time: "8:00 AM",
      completed: false,
      icon: "pill",
      assignedTo: "1",
    },
    {
      id: "2",
      title: "Change Grandma's bandage",
      time: "10:30 AM",
      completed: false,
      icon: "bandage",
      assignedTo: "4",
    },
    {
      id: "3",
      title: "Take Grandma's blood pressure",
      time: "2:00 PM",
      completed: false,
      icon: "heart",
      assignedTo: "2",
    },
    {
      id: "4",
      title: "Help Grandma with physical therapy",
      time: "4:30 PM",
      completed: false,
      icon: "medicine",
      assignedTo: "3",
    },
  ])

  const [newTask, setNewTask] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("12:00 PM")
  const [progress, setProgress] = useState(0)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const familyMembers: FamilyMember[] = [
    {
      id: "1",
      name: "Mom",
      avatar: "/placeholder.svg?height=40&width=40",
      available: true,
      careResponsibility: true,
      careNote: "Morning medication",
    },
    {
      id: "2",
      name: "Dad",
      avatar: "/placeholder.svg?height=40&width=40",
      available: true,
      careResponsibility: true,
      careNote: "Afternoon checkups",
    },
    {
      id: "3",
      name: "Emma",
      avatar: "/placeholder.svg?height=40&width=40",
      available: false,
      careResponsibility: true,
      careNote: "Evening assistance",
    },
    {
      id: "4",
      name: "Jack",
      avatar: "/placeholder.svg?height=40&width=40",
      available: true,
      careResponsibility: true,
      careNote: "Wound care",
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (!user) {
        router.push("/login")
      }
    }

    // Calculate progress
    const completedTasks = tasks.filter((task) => task.completed).length
    const totalTasks = tasks.length
    setProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)
  }, [tasks, router])

  const addTask = () => {
    if (newTask.trim() === "") return

    const newTaskItem: Task = {
      id: Date.now().toString(),
      title: newTask,
      time: newTaskTime,
      completed: false,
      icon: "pill",
    }

    setTasks([...tasks, newTaskItem])
    setNewTask("")
    setNewTaskTime("12:00 PM")
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))

    // In a real app, this would notify other family members
    console.log(`Task ${taskId} status changed`)
  }

  const confirmDeleteTask = (taskId: string) => {
    setDeleteTaskId(taskId)
    setDeleteDialogOpen(true)
  }

  const deleteTask = () => {
    if (deleteTaskId) {
      setTasks(tasks.filter((task) => task.id !== deleteTaskId))
      setDeleteTaskId(null)
      setDeleteDialogOpen(false)
    }
  }

  const getTaskIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case "pill":
        return <Pill className="h-4 w-4 mr-2 text-blue-500" />
      case "bandage":
        return <HeartPulse className="h-4 w-4 mr-2 text-red-500" />
      case "heart":
        return <HeartPulse className="h-4 w-4 mr-2 text-pink-500" />
      case "medicine":
        return <Stethoscope className="h-4 w-4 mr-2 text-green-500" />
      default:
        return <Clock className="h-4 w-4 mr-2 text-gray-500" />
    }
  }

  const getMemberById = (id: string | undefined) => {
    if (!id) return null
    return familyMembers.find((member) => member.id === id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      <UserProfile />

      <main className="container mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-6">Grandma's Care Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Grandma's Care Tasks</span>
                <Badge variant="outline" className="ml-2">
                  {tasks.filter((t) => t.completed).length}/{tasks.length}
                </Badge>
              </CardTitle>
              <CardDescription>Daily care tasks for Grandma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                  <span>{Math.round(progress)}% completed</span>
                  <span>
                    {tasks.filter((t) => t.completed).length} of {tasks.length} tasks
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map((task) => {
                  const assignedMember = getMemberById(task.assignedTo)

                  return (
                    <div
                      key={task.id}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 group"
                    >
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          {getTaskIcon(task.icon)}
                          <Label
                            htmlFor={`task-${task.id}`}
                            className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </Label>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.time}
                          {assignedMember && (
                            <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                              Assigned to: {assignedMember.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {task.completed && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => confirmDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Add New Care Task for Grandma</h3>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter care task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                  </div>
                  <TimePickerDemo value={newTaskTime} onChange={setNewTaskTime} />
                  <Button
                    onClick={addTask}
                    size="icon"
                    className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nest Members</CardTitle>
              <CardDescription>Who's available today for Grandma's care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-4 p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {member.careResponsibility && (
                        <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-0.5">
                          <HeartPulse className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      {member.careResponsibility && (
                        <p className="text-xs text-pink-600 dark:text-pink-400">{member.careNote}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge
                        variant={member.available ? "default" : "outline"}
                        className={member.available ? "bg-green-500 dark:bg-green-600" : ""}
                      >
                        {member.available ? "Available" : "Unavailable"}
                      </Badge>
                      {member.careResponsibility && (
                        <span className="text-xs text-pink-600 dark:text-pink-400 mt-1">Care Provider</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30">
                <div className="flex items-center mb-3">
                  <div className="mr-3 bg-white dark:bg-gray-800 p-2 rounded-full">
                    <Stethoscope className="h-5 w-5 text-pink-500" />
                  </div>
                  <h3 className="font-medium">Grandma's Care Schedule</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  All family members are helping with Grandma's care today. Mom handles morning medication, Dad does
                  afternoon checkups, Emma assists in the evening, and Jack takes care of wound dressing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="fixed bottom-4 right-4">
        <EmergencyButton />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this care task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTaskId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTask} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
