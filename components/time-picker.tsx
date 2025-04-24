"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = ["00", "15", "30", "45"]
  const periods = ["AM", "PM"]

  const parseTime = (timeString: string) => {
    const [time, period] = timeString.split(" ")
    const [hour, minute] = time.split(":")
    return {
      hour: Number.parseInt(hour),
      minute: minute,
      period: period,
    }
  }

  const { hour, minute, period } = parseTime(value)

  const handleHourChange = (newHour: number) => {
    onChange(`${newHour}:${minute} ${period}`)
    setOpen(false)
  }

  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hour}:${newMinute} ${period}`)
    setOpen(false)
  }

  const handlePeriodChange = (newPeriod: string) => {
    onChange(`${hour}:${minute} ${newPeriod}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[120px] justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid grid-cols-3 gap-2 p-2">
          <div className="space-y-2">
            <Label className="text-xs">Hour</Label>
            <div className="grid grid-cols-4 gap-1">
              {hours.map((h) => (
                <Button
                  key={h}
                  size="sm"
                  variant={h === hour ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => handleHourChange(h)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Minute</Label>
            <div className="grid grid-cols-2 gap-1">
              {minutes.map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={m === minute ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  onClick={() => handleMinuteChange(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Period</Label>
            <div className="grid grid-cols-1 gap-1">
              {periods.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === period ? "default" : "outline"}
                  className="h-8"
                  onClick={() => handlePeriodChange(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
