"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import NavBar from "@/components/nav-bar"
import EmergencyButton from "@/components/emergency-button"
import UserProfile from "@/components/user-profile"
import { MessageCircle, Trash2, ChevronLeft, ChevronRight, Sun, Coffee, Sunset } from "lucide-react"
import { Label } from "@/components/ui/label"

interface FamilyMember {
  id: string
  name: string
  avatar: string
  color: string
}

interface Availability {
  date: Date
  memberId: string
  timePeriod: "morning" | "afternoon" | "evening" | "fullday"
}

interface Comment {
  id: string
  memberId: string
  text: string
  date: Date
}

export default function CalendarPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  // Initialize weekDates with the current week
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(new Date()))
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<"morning" | "afternoon" | "evening" | "fullday">(
    "fullday",
  )

  const familyMembers: FamilyMember[] = [
    { id: "1", name: "Mom", avatar: "/placeholder.svg?height=40&width=40", color: "pink" },
    { id: "2", name: "Dad", avatar: "/placeholder.svg?height=40&width=40", color: "blue" },
    { id: "3", name: "Emma", avatar: "/placeholder.svg?height=40&width=40", color: "purple" },
    { id: "4", name: "Jack", avatar: "/placeholder.svg?height=40&width=40", color: "green" },
  ]

  // Get dates for the week containing the given date
  function getWeekDates(date: Date): Date[] {
    const result = []
    const currentDate = new Date(date)

    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const day = currentDate.getDay()

    // Calculate the date of Monday (first day of the week)
    // If day is 0 (Sunday), go back 6 days to get to Monday
    // Otherwise, go back (day - 1) days
    const diff = day === 0 ? 6 : day - 1

    // Set the date to Monday
    currentDate.setDate(currentDate.getDate() - diff)

    // Add 7 days to the array
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(currentDate)
      result.push(newDate)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  }

  // Generate week dates based on selected date
  useEffect(() => {
    const dates = getWeekDates(selectedDate)
    setWeekDates(dates)
  }, [selectedDate])

  // Sample data
  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (!user) {
        router.push("/login")
        return
      }
    }

    // Initialize with some sample data
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dayAfter = new Date(today)
    dayAfter.setDate(dayAfter.getDate() + 2)

    // Load saved availabilities from localStorage
    if (typeof window !== "undefined") {
      const savedAvailabilities = localStorage.getItem("wellnest_availabilities")
      if (savedAvailabilities) {
        try {
          const parsedAvailabilities = JSON.parse(savedAvailabilities)
          // Convert string dates back to Date objects
          const convertedAvailabilities = parsedAvailabilities.map((a: any) => ({
            ...a,
            date: new Date(a.date),
          }))
          setAvailabilities(convertedAvailabilities)
        } catch (error) {
          console.error("Error parsing saved availabilities:", error)
          // If there's an error parsing, use default availabilities
          setAvailabilities([
            { date: today, memberId: "1", timePeriod: "morning" },
            { date: today, memberId: "2", timePeriod: "afternoon" },
            { date: tomorrow, memberId: "3", timePeriod: "evening" },
            { date: tomorrow, memberId: "4", timePeriod: "fullday" },
            { date: dayAfter, memberId: "1", timePeriod: "morning" },
            { date: dayAfter, memberId: "3", timePeriod: "afternoon" },
          ])
        }
      } else {
        // Use default availabilities if none are saved
        setAvailabilities([
          { date: today, memberId: "1", timePeriod: "morning" },
          { date: today, memberId: "2", timePeriod: "afternoon" },
          { date: tomorrow, memberId: "3", timePeriod: "evening" },
          { date: tomorrow, memberId: "4", timePeriod: "fullday" },
          { date: dayAfter, memberId: "1", timePeriod: "morning" },
          { date: dayAfter, memberId: "3", timePeriod: "afternoon" },
        ])
      }

      // Load saved comments from localStorage
      const savedComments = localStorage.getItem("wellnest_comments")
      if (savedComments) {
        try {
          const parsedComments = JSON.parse(savedComments)
          // Convert string dates back to Date objects
          const convertedComments = parsedComments.map((c: any) => ({
            ...c,
            date: new Date(c.date),
          }))
          setComments(convertedComments)
        } catch (error) {
          console.error("Error parsing saved comments:", error)
          // If there's an error parsing, use default comments
          setComments([
            {
              id: "1",
              memberId: "1",
              text: "I'll be taking care of Grandma's medication in the morning",
              date: today,
            },
            {
              id: "2",
              memberId: "3",
              text: "I can help with physical therapy in the evening",
              date: tomorrow,
            },
          ])
        }
      } else {
        // Use default comments if none are saved
        setComments([
          {
            id: "1",
            memberId: "1",
            text: "I'll be taking care of Grandma's medication in the morning",
            date: today,
          },
          {
            id: "2",
            memberId: "3",
            text: "I can help with physical therapy in the evening",
            date: tomorrow,
          },
        ])
      }
    }
  }, [router])

  // Save availabilities to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && availabilities.length > 0) {
      localStorage.setItem("wellnest_availabilities", JSON.stringify(availabilities))
    }
  }, [availabilities])

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && comments.length > 0) {
      localStorage.setItem("wellnest_comments", JSON.stringify(comments))
    }
  }, [comments])

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  // Format date for display
  const formatDateHeader = (date: Date | undefined): string => {
    if (!date) return "Calendar"

    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const toggleAvailability = () => {
    if (!selectedMember || !selectedDate) return

    const existingAvailability = availabilities.find(
      (a) => isSameDay(a.date, selectedDate) && a.memberId === selectedMember && a.timePeriod === selectedTimePeriod,
    )

    if (existingAvailability) {
      // Remove availability
      setAvailabilities(
        availabilities.filter(
          (a) =>
            !(isSameDay(a.date, selectedDate) && a.memberId === selectedMember && a.timePeriod === selectedTimePeriod),
        ),
      )
    } else {
      // Add availability
      setAvailabilities([
        ...availabilities,
        {
          date: new Date(selectedDate),
          memberId: selectedMember,
          timePeriod: selectedTimePeriod,
        },
      ])
    }
  }

  const addComment = () => {
    if (!selectedDate || newComment.trim() === "") return

    const comment: Comment = {
      id: Date.now().toString(),
      memberId: "1", // Current user (Mom in this example)
      text: newComment,
      date: new Date(selectedDate),
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const confirmDeleteComment = (commentId: string) => {
    setDeleteCommentId(commentId)
    setDeleteDialogOpen(true)
  }

  const deleteComment = () => {
    if (deleteCommentId) {
      setComments(comments.filter((comment) => comment.id !== deleteCommentId))
      setDeleteCommentId(null)
      setDeleteDialogOpen(false)
    }
  }

  const isSameDay = (date1: Date | undefined, date2: Date | undefined) => {
    // Return false if either date is undefined or invalid
    if (
      !date1 ||
      !date2 ||
      !(date1 instanceof Date) ||
      !(date2 instanceof Date) ||
      isNaN(date1.getTime()) ||
      isNaN(date2.getTime())
    ) {
      return false
    }

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const getAvailableMembersForDate = (day: Date) => {
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
      return []
    }

    return availabilities.filter((a) => isSameDay(a.date, day))
  }

  const getCommentsForDate = (date: Date | undefined) => {
    if (!date) return []

    return comments.filter((c) => isSameDay(c.date, date)).sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const getColorHex = (color: string) => {
    switch (color) {
      case "pink":
        return "#ec4899"
      case "blue":
        return "#3b82f6"
      case "purple":
        return "#8b5cf6"
      case "green":
        return "#22c55e"
      default:
        return "#ccc"
    }
  }

  const getTimePeriodIcon = (timePeriod: string) => {
    switch (timePeriod) {
      case "morning":
        return <Coffee className="h-4 w-4 text-orange-500" />
      case "afternoon":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "evening":
        return <Sunset className="h-4 w-4 text-indigo-500" />
      case "fullday":
        return <Sun className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const isMemberAvailableOnSelectedDate = (memberId: string, timePeriod: string) => {
    return availabilities.some(
      (a) => a.memberId === memberId && isSameDay(a.date, selectedDate) && a.timePeriod === timePeriod,
    )
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return isSameDay(date, today)
  }

  const isSelected = (date: Date) => {
    return isSameDay(date, selectedDate)
  }

  // Day of week labels
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      <UserProfile />

      <main className="container mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-6">Family Calendar</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left column - Calendar */}
          <div>
            <Card className="shadow-md border-0 dark:border-gray-700">
              <CardHeader className="bg-white dark:bg-gray-800 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                    {weekDates.length > 0 ? formatDateHeader(weekDates[0]) : "Calendar"}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={goToNextWeek}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>Select a date to view and manage availability</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {/* Weekly Calendar */}
                <div className="bg-[#ffd1dc] rounded-md overflow-hidden p-4">
                  {/* Day labels */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayLabels.map((day, index) => (
                      <div key={index} className="text-center text-black font-bold text-xs">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {weekDates.map((date, index) => {
                      const availableMembers = getAvailableMembersForDate(date)
                      const isSelectedDay = isSelected(date)
                      const isTodayDay = isToday(date)

                      return (
                        <button
                          key={index}
                          className={`
                            h-20 p-1 flex flex-col items-center justify-start 
                            ${isSelectedDay ? "bg-pink-500" : isTodayDay ? "bg-pink-200/50" : "hover:bg-pink-300/30"}
                            transition-colors
                          `}
                          onClick={() => setSelectedDate(date)}
                        >
                          <span
                            className={`
                            text-black font-bold text-lg mb-1
                            ${isSelectedDay ? "bg-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-white" : ""}
                          `}
                          >
                            {date.getDate()}
                          </span>

                          {availableMembers.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1 mt-auto">
                              {availableMembers.map((availability, idx) => {
                                const member = familyMembers.find((m) => m.id === availability.memberId)
                                return (
                                  <div
                                    key={`${availability.memberId}-${availability.timePeriod}-${idx}`}
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: member ? getColorHex(member.color) : "#ccc" }}
                                  />
                                )
                              })}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Availability Legend</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-orange-500" />
                      <span className="text-xs">Morning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs">Afternoon</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs">Evening</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-green-500" />
                      <span className="text-xs">Full Day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-gray-200 dark:border-gray-700 mt-6">
              <CardHeader className="bg-white dark:bg-gray-800 pb-2">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardDescription>Manage who's available on this date</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <Label htmlFor="member-select">Family Member</Label>
                    <Select value={selectedMember} onValueChange={setSelectedMember}>
                      <SelectTrigger id="member-select">
                        <SelectValue placeholder="Select family member" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Availability Time</Label>
                    <RadioGroup
                      value={selectedTimePeriod}
                      onValueChange={(value) => setSelectedTimePeriod(value as any)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="morning" id="morning" />
                        <Label htmlFor="morning" className="flex items-center">
                          <Coffee className="h-4 w-4 mr-2 text-orange-500" />
                          Morning
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon" className="flex items-center">
                          <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                          Afternoon
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="evening" id="evening" />
                        <Label htmlFor="evening" className="flex items-center">
                          <Sunset className="h-4 w-4 mr-2 text-indigo-500" />
                          Evening
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fullday" id="fullday" />
                        <Label htmlFor="fullday" className="flex items-center">
                          <Sun className="h-4 w-4 mr-2 text-green-500" />
                          Full Day
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={toggleAvailability}
                    className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800"
                    disabled={!selectedMember}
                  >
                    {isMemberAvailableOnSelectedDate(selectedMember, selectedTimePeriod)
                      ? "Remove Availability"
                      : "Mark as Available"}
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Available Family Members</h3>
                  <div className="space-y-2">
                    {familyMembers.map((member) => {
                      const morningAvailable = isMemberAvailableOnSelectedDate(member.id, "morning")
                      const afternoonAvailable = isMemberAvailableOnSelectedDate(member.id, "afternoon")
                      const eveningAvailable = isMemberAvailableOnSelectedDate(member.id, "evening")
                      const fulldayAvailable = isMemberAvailableOnSelectedDate(member.id, "fullday")
                      const isAvailable = morningAvailable || afternoonAvailable || eveningAvailable || fulldayAvailable

                      return (
                        <div
                          key={member.id}
                          className={`flex items-center space-x-4 p-3 rounded-md border ${
                            isAvailable
                              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                              : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20"
                          }`}
                        >
                          <Avatar className="h-8 w-8 border-2" style={{ borderColor: getColorHex(member.color) }}>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback style={{ backgroundColor: getColorHex(member.color), color: "white" }}>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            {isAvailable && (
                              <div className="flex items-center mt-1 space-x-2">
                                {morningAvailable && <Coffee className="h-3 w-3 text-orange-500" />}
                                {afternoonAvailable && <Sun className="h-3 w-3 text-yellow-500" />}
                                {eveningAvailable && <Sunset className="h-3 w-3 text-indigo-500" />}
                                {fulldayAvailable && <Sun className="h-3 w-3 text-green-500" />}
                              </div>
                            )}
                          </div>
                          <div>
                            {isAvailable ? (
                              <span className="text-xs text-green-600 dark:text-green-400">Available</span>
                            ) : (
                              <span className="text-xs text-gray-500">Not available</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Comments */}
          <div>
            <Card className="shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-white dark:bg-gray-800 pb-2">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Comments & Notes</CardTitle>
                <CardDescription>
                  Add notes and reminders for{" "}
                  {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[400px] rounded-md border border-gray-200 dark:border-gray-700 p-4 mb-4">
                  {getCommentsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-4">
                      {getCommentsForDate(selectedDate).map((comment) => {
                        const member = familyMembers.find((m) => m.id === comment.memberId)
                        return (
                          <div
                            key={comment.id}
                            className="flex gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 group border border-gray-200 dark:border-gray-700"
                          >
                            <Avatar
                              className="h-8 w-8 border-2"
                              style={{ borderColor: member ? getColorHex(member.color) : "#ccc" }}
                            >
                              <AvatarImage src={member?.avatar || "/placeholder.svg"} alt={member?.name} />
                              <AvatarFallback
                                style={{
                                  backgroundColor: member ? getColorHex(member.color) : "#ccc",
                                  color: "white",
                                }}
                              >
                                {member?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{member?.name}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(comment.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => confirmDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No comments for this date</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <Textarea
                    placeholder="Add a comment or note..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-gray-200 dark:border-gray-700 focus-visible:ring-pink-500 min-h-[100px]"
                  />
                  <Button
                    onClick={addComment}
                    className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
                    disabled={newComment.trim() === ""}
                  >
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 right-4">
        <EmergencyButton />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCommentId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteComment} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
