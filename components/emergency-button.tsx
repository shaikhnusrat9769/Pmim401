"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
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

export default function EmergencyButton() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const handleEmergency = () => {
    // In a real app, this would send a notification to the emergency contact
    console.log("Emergency alert sent")
    setSent(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setSent(false)
      setOpen(false)
    }, 3000)
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className="rounded-full h-16 w-16 shadow-lg"
        onClick={() => setOpen(true)}
      >
        <AlertCircle className="h-8 w-8" />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emergency Alert</AlertDialogTitle>
            <AlertDialogDescription>
              {sent
                ? "Emergency alert has been sent to your emergency contact."
                : "Are you sure you want to send an emergency alert to your emergency contact?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!sent && (
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergency}>Send Alert</AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
