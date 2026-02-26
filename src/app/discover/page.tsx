"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Briefcase, Heart, Users, MapPin, Coffee, Mountain, TreePine, Navigation } from "lucide-react"

import { GuidedStep } from "@/components/shared/guided-step"
import { DateRangePicker } from "@/components/shared/date-range-picker"
import { DateRange } from "react-day-picker"

export default function DiscoverPage() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  
  const [purpose, setPurpose] = React.useState<string>()
  const [region, setRegion] = React.useState<string>()
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [guests, setGuests] = React.useState<string>()

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => s + 1)
    } else {
      // Build query string
      const params = new URLSearchParams()
      if (purpose) params.set("purpose", purpose)
      if (region) params.set("region", region)
      if (dateRange?.from) params.set("checkin", format(dateRange.from, "yyyy-MM-dd"))
      if (dateRange?.to) params.set("checkout", format(dateRange.to, "yyyy-MM-dd"))
      if (guests) params.set("guests", guests)
      
      router.push(`/places?${params.toString()}`)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1)
    } else {
      router.push("/")
    }
  }

  const purposeOptions = [
    { id: "working", label: "Working remotely", description: "Need good WiFi and a quiet space", icon: <Briefcase className="h-6 w-6" /> },
    { id: "resting", label: "Resting", description: "Looking for peace and comfort", icon: <Coffee className="h-6 w-6" /> },
    { id: "family", label: "Family travel", description: "Safe and spacious for everyone", icon: <Users className="h-6 w-6" /> },
    { id: "retreat", label: "Group retreat", description: "Connecting with my team", icon: <Heart className="h-6 w-6" /> },
  ]

  const regionOptions = [
    { id: "dhaka", label: "Dhaka", description: "The bustling capital", icon: <Navigation className="h-6 w-6" /> },
    { id: "sylhet", label: "Sylhet", description: "Tea gardens and hills", icon: <TreePine className="h-6 w-6" /> },
    { id: "chittagong", label: "Chittagong & Hill Tracts", description: "Mountains and sea", icon: <Mountain className="h-6 w-6" /> },
    { id: "rajshahi", label: "Rajshahi", description: "The silk city", icon: <MapPin className="h-6 w-6" /> },
    { id: "khulna", label: "Khulna & Barisal", description: "Rivers and Sundarbans", icon: <MapPin className="h-6 w-6" /> },
    { id: "any", label: "I'm flexible", description: "Show me the best places anywhere", icon: <MapPin className="h-6 w-6" /> },
  ]

  const guestOptions = [
    { id: "1", label: "Just me", icon: <Users className="h-6 w-6" /> },
    { id: "2", label: "2 people", icon: <Users className="h-6 w-6" /> },
    { id: "3", label: "3 people", icon: <Users className="h-6 w-6" /> },
    { id: "4plus", label: "4 or more", icon: <Users className="h-6 w-6" /> },
  ]

  return (
    <div className="min-h-screen bg-muted/10 p-4 md:p-8 flex items-center justify-center">
      {step === 1 && (
        <GuidedStep
          step={1}
          totalSteps={4}
          question="What brings you here?"
          options={purposeOptions}
          selectedValue={purpose}
          onSelect={setPurpose}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {step === 2 && (
        <GuidedStep
          step={2}
          totalSteps={4}
          question="Where are you headed?"
          options={regionOptions}
          selectedValue={region}
          onSelect={setRegion}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
      {step === 3 && (
        <GuidedStep
          step={3}
          totalSteps={4}
          question="When are you arriving?"
          onBack={handleBack}
          onNext={handleNext}
          nextDisabled={!dateRange?.from}
        >
          <div className="bg-card p-8 rounded-xl border shadow-sm max-w-md mx-auto">
            <label className="block text-sm font-medium text-muted-foreground mb-4">Select your travel dates</label>
            <DateRangePicker 
              date={dateRange} 
              onDateChange={setDateRange} 
            />
          </div>
        </GuidedStep>
      )}
      {step === 4 && (
        <GuidedStep
          step={4}
          totalSteps={4}
          question="How many guests?"
          options={guestOptions}
          selectedValue={guests}
          onSelect={setGuests}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
