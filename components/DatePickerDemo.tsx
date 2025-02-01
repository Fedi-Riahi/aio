"use client"

import * as React from "react"
import { format } from "date-fns"
import { IconCalendarWeek } from '@tabler/icons-react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full py-6 justify-start text-left font-normal bg-foreground/10 relative",
            !date && "text-muted-foreground"
          )}
        >
          <IconCalendarWeek className="absolute left-3 top-4 h-8 w-8 text-gray-400" />
          {date ? format(date, "PPP") : <span className="pl-4 text-gray-400">Birthday Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
