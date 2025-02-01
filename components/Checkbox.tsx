"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col justify-center items-start space-y-4">
        <div className="flex items-center justify-start gap-2 my-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
        Accept terms and conditions
      </label>
          </div>
    <div className="flex items-center justify-start gap-2">
      <Checkbox id="politics" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
      </div>
      </div>
  )
}
