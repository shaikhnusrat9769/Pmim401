"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Moon, Sun, LogOut } from "lucide-react"
import NavBar from "@/components/nav-bar"
import EmergencyButton from "@/components/emergency-button"
import { useTheme } from "@/components/theme-provider"
import UserProfile from "@/components/user-profile"

interface FamilyMember {
  id: string
  name: string
  avatar: string
  email: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [darkMode, setDarkMode] = useState(theme === "dark")
  const [notifications, setNotifications] = useState(true)
  const [taskNotifications, setTaskNotifications] = useState(true)
  const [emergencyContact, setEmergencyContact] = useState("1") // Mom's ID

  const familyMembers: FamilyMember[] = [
    { id: "1", name: "Mom", avatar: "/placeholder.svg?height=40&width=40", email: "mom@example.com" },
    { id: "2", name: "Dad", avatar: "/placeholder.svg?height=40&width=40", email: "dad@example.com" },
    { id: "3", name: "Emma", avatar: "/placeholder.svg?height=40&width=40", email: "emma@example.com" },
    { id: "4", name: "Jack", avatar: "/placeholder.svg?height=40&width=40", email: "jack@example.com" },
  ]

  const [familyId, setFamilyId] = useState("FAM12345")

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (!user) {
        router.push("/login")
      }
    }

    // Set initial dark mode state based on theme
    setDarkMode(theme === "dark")
  }, [router, theme])

  // Update theme when dark mode toggle changes
  useEffect(() => {
    setTheme(darkMode ? "dark" : "light")
  }, [darkMode, setTheme])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      <UserProfile />

      <main className="container mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-6">Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account and family information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="family-id">Family ID</Label>
                  <div className="flex gap-2">
                    <Input id="family-id" value={familyId} readOnly />
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(familyId)}>
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this ID with family members so they can join your family space
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Family Members</Label>
                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-4 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                        {member.id === "1" && (
                          <Badge variant="outline" className="bg-pink-100 dark:bg-pink-900">
                            Admin
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how Wellnest looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="notifications">Enable Notifications</Label>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-notifications">Task Completion Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get notified when family members complete tasks</p>
                  </div>
                  <Switch
                    id="task-notifications"
                    checked={taskNotifications}
                    onCheckedChange={setTaskNotifications}
                    disabled={!notifications}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Set who receives emergency alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={emergencyContact} onValueChange={setEmergencyContact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-sm text-muted-foreground">
                  The emergency contact will receive alerts when any family member presses the emergency button
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 right-4">
        <EmergencyButton />
      </div>
    </div>
  )
}
