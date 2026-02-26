"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Search, CalendarDays, Users, MapPin } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const divisions = [
  { value: "any", label: "Anywhere" },
  { value: "dhaka", label: "Dhaka" },
  { value: "sylhet", label: "Sylhet" },
  { value: "chittagong", label: "Chittagong" },
  { value: "rajshahi", label: "Rajshahi" },
  { value: "khulna", label: "Khulna" },
  { value: "barisal", label: "Barisal" },
]

const guestOptions = [
  { value: "1", label: "1 guest" },
  { value: "2", label: "2 guests" },
  { value: "3", label: "3 guests" },
  { value: "4", label: "4+ guests" },
]

export function SearchBar() {
  const router = useRouter()
  const [region, setRegion] = React.useState("any")
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [guests, setGuests] = React.useState("2")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (region !== "any") params.set("region", region)
    if (date?.from) params.set("checkin", format(date.from, "yyyy-MM-dd"))
    if (date?.to) params.set("checkout", format(date.to, "yyyy-MM-dd"))
    if (guests) params.set("guests", guests)
    router.push(`/places?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Desktop layout */}
      <div className="hidden md:flex items-center rounded-full border bg-card shadow-lg p-1.5">
        {/* Destination */}
        <div className="flex-1 min-w-0">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="border-0 shadow-none bg-transparent h-12 rounded-full pl-5 focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2 text-left">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Where to?" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="h-8 w-px bg-border shrink-0" />

        {/* Dates */}
        <div className="flex-1 min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center gap-2 h-12 px-5 text-sm hover:bg-muted/50 rounded-full transition-colors">
                <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                {date?.from ? (
                  <span className="truncate">
                    {format(date.from, "MMM d")}
                    {date.to ? ` - ${format(date.to, "MMM d")}` : ""}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Any dates</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <span className="h-8 w-px bg-border shrink-0" />

        {/* Guests */}
        <div className="w-36 shrink-0">
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="border-0 shadow-none bg-transparent h-12 rounded-full focus:ring-0 focus:ring-offset-0">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {guestOptions.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search button */}
        <Button
          onClick={handleSearch}
          size="icon"
          className="h-11 w-11 rounded-full shrink-0"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {/* Mobile layout: stacked */}
      <div className="flex md:hidden flex-col gap-3 rounded-2xl border bg-card p-4 shadow-lg">
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="h-12 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Where to?" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {divisions.map((d) => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center gap-2 h-12 px-3 text-sm border rounded-xl hover:bg-muted/50 transition-colors">
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              {date?.from ? (
                <span>
                  {format(date.from, "MMM d")}
                  {date.to ? ` - ${format(date.to, "MMM d")}` : ""}
                </span>
              ) : (
                <span className="text-muted-foreground">Any dates</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="h-12 rounded-xl">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {guestOptions.map((g) => (
              <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="h-12 rounded-xl w-full">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </div>
    </div>
  )
}
