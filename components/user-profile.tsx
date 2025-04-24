"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, User } from "lucide-react"

interface UserData {
  email?: string
  familyId?: string
  name?: string
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState("")

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== "undefined") {
      const userDataStr = localStorage.getItem("user")
      if (userDataStr) {
        try {
          const parsedData = JSON.parse(userDataStr) as UserData
          setUserData(parsedData)

          // Set display name from localStorage if it exists
          const savedName = localStorage.getItem("userName")
          if (savedName) {
            setDisplayName(savedName)
          } else if (parsedData.email) {
            // Use email as fallback
            setDisplayName(parsedData.email.split("@")[0])
          } else {
            setDisplayName("Family Member")
          }
        } catch (e) {
          console.error("Error parsing user data", e)
        }
      }
    }
  }, [])

  const handleSaveName = () => {
    if (tempName.trim()) {
      setDisplayName(tempName.trim())
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", tempName.trim())
      }
      setIsEditing(false)
    }
  }

  return (
    <div className="fixed top-0 right-0 z-40 p-4 md:p-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full h-10 px-4 md:h-10">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={displayName} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{displayName}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt={displayName} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                {isEditing ? (
                  <div className="flex items-end gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-8"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSaveName}
                      className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{displayName}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempName(displayName)
                        setIsEditing(true)
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                )}
                {userData?.email && <p className="text-xs text-muted-foreground">{userData.email}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium">Family ID</h4>
              <p className="text-xs bg-muted p-2 rounded">{userData?.familyId || "Not available"}</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
