"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AppDateSelectProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
  noLabel?: boolean;
  minDate?: Date;
}

export function AppDateSelect({
  label = "Date",
  value,
  onChange,
  className = "",
  noLabel = false,
  minDate
}: AppDateSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)

  const handleSelect = (date?: Date) => {
    setSelectedDate(date)
    setOpen(false)
    onChange?.(date)
  }
  const currentYear = new Date().getFullYear()

  const normalizedMinDate = minDate
    ? new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate()
      )
    : undefined;

  return (
        <div className={`stack-md ${className}`}>
            {!noLabel && <Label htmlFor="date-picker">{label}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-picker"
                        className="w-40 justify-between font-normal"
                    >
                        {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            })
                        : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        startMonth={new Date(currentYear - 5, 0)}
                        endMonth={new Date(currentYear + 10, 11)}
                        disabled={(date) =>
                            normalizedMinDate ? date < normalizedMinDate : false
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
  )
}
