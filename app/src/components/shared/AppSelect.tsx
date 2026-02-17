"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import { Inbox } from "lucide-react"

interface GenericSelectProps {
  label?: string
  groupLabel?: string
  placeholder?: string
  items: string[] | { label: string; value: string }[]
  value?: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean,
  searchPlaceholder?: string;
  search?: string;
  setSearch?: (i: string) => void,
  triggerClassName?: string
}

export function AppSelect({
  label,
  groupLabel,
  placeholder = "Select an option",
  items,
  value,
  onChange,
  className,
  disabled,
  searchPlaceholder,
  search,
  setSearch,
  triggerClassName,
}: GenericSelectProps) {
  return (
        <div className={`flex flex-col gap-1 ${className ?? ""}`}>
            {label && <span className="text-sm font-medium text-gray-700">{label}</span>}

            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className={`w-full border border-gray-300 rounded-md ${triggerClassName}`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                <SelectGroup>
                    {setSearch && (
                        <Input 
                            value={ search }
                            placeholder={ searchPlaceholder ?? "Search for an item" }
                            onChange={ e => setSearch(e.target.value) }
                            onKeyDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                    )}
                    <SelectLabel>{ groupLabel }</SelectLabel>
                    {items.length === 0 && (
                        <div className="flex-center flex-col gap-2 my-4">
                            <Inbox className="text-gray w-10 h-10" />
                            <div className="text-gray">No items to display</div>
                        </div>
                    )}
                    {items.map((item, idx) => {
                        // Handle both string and object items
                        const label = typeof item === "string" ? item : item.label
                        const val = typeof item === "string" ? item : item.value

                        return (
                            <SelectItem key={idx} value={val}>
                                {label}
                            </SelectItem>
                        )
                    })}
                </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
