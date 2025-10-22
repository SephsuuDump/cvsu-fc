"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface AppTimeSelectProps {
    label?: string
    value?: string
    onChange?: (time: string) => void
    className?: string
    noLabel?: boolean
}

export function AppTimeSelect({
    label = "Time",
    value = "",
    onChange,
    className = "",
    noLabel = false,
}: AppTimeSelectProps) {
    const [time, setTime] = React.useState(value)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTime(val)
        onChange?.(val)
    }

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {!noLabel && <Label htmlFor="time-picker">{label}</Label>}
            <Input
                id="time-picker"
                type="time"
                step="1"
                value={time}
                onChange={handleChange}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
        </div>
    )
}
