"use client"

import React, { useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookingRequestMessage } from "@/components/shared/booking-request-message"
import {
  mockThreads as initialThreads,
  mockBookings,
  mockOperatorProfile,
  type MockThread,
  type MockMessage,
} from "@/lib/mock-data"
import { format } from "date-fns"
import { Send, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useStaffPermission } from "@/lib/utils/permissions"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getGuestNameForThread(
  bookingId: string,
  messages: MockMessage[]
): string {
  const guestMessage = messages.find(
    (m) => m.senderId !== mockOperatorProfile.id && m.senderId !== "system"
  )
  if (guestMessage) return guestMessage.senderName
  const reqMsg = messages.find((m) => m.type === "booking_request")
  if (reqMsg?.bookingRequestData) return reqMsg.bookingRequestData.guestName
  const booking = mockBookings.find((b) => b.id === bookingId)
  return booking?.bookingCode ?? "Guest"
}

function getBookingCode(bookingId: string): string {
  const booking = mockBookings.find((b) => b.id === bookingId)
  return booking?.bookingCode ?? bookingId
}

function hasPendingRequest(thread: MockThread): boolean {
  return thread.messages.some(
    (m) =>
      m.type === "booking_request" &&
      m.bookingRequestData?.status === "pending"
  )
}

function OperatorMessagesContent() {
  const { canAct } = useStaffPermission("messages")
  const searchParams = useSearchParams()
  const bookingParam = searchParams.get("booking")

  const [threads, setThreads] = useState<MockThread[]>(initialThreads)

  const initialThread = bookingParam
    ? threads.find((t) => t.bookingId === bookingParam)?.id ?? threads[0]?.id ?? null
    : threads[0]?.id ?? null

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThread)
  const [messageInput, setMessageInput] = useState("")

  const selectedThread = threads.find((t) => t.id === selectedThreadId)

  function handleSend() {
    if (!messageInput.trim() || !selectedThread) return
    const newMsg: MockMessage = {
      id: `m-new-${Date.now()}`,
      bookingId: selectedThread.bookingId,
      senderId: mockOperatorProfile.id,
      senderName: "Operator",
      content: messageInput,
      type: "text",
      readAt: null,
      createdAt: new Date().toISOString(),
    }
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: messageInput,
              lastMessageAt: newMsg.createdAt,
            }
          : t
      )
    )
    setMessageInput("")
  }

  const handleApprove = useCallback(
    (bookingId: string) => {
      setThreads((prev) =>
        prev.map((t) => {
          const updatedMessages = t.messages.map((m) => {
            if (
              m.type === "booking_request" &&
              m.bookingRequestData?.bookingId === bookingId
            ) {
              return {
                ...m,
                bookingRequestData: {
                  ...m.bookingRequestData,
                  status: "approved" as const,
                },
              }
            }
            return m
          })

          const hasApproval = updatedMessages.some(
            (m) =>
              m.type === "booking_request" &&
              m.bookingRequestData?.bookingId === bookingId
          )

          if (hasApproval) {
            const systemMsg: MockMessage = {
              id: `m-sys-${Date.now()}`,
              bookingId: t.bookingId,
              senderId: "system",
              senderName: "Dhara Platform",
              content: "Booking has been approved. The guest has been notified and the room is now reserved.",
              type: "system",
              readAt: null,
              createdAt: new Date().toISOString(),
            }
            return {
              ...t,
              messages: [...updatedMessages, systemMsg],
              lastMessage: "Booking approved",
              lastMessageAt: systemMsg.createdAt,
              unreadCount: 0,
            }
          }
          return { ...t, messages: updatedMessages }
        })
      )
      toast.success("Booking approved! Guest has been notified.")
    },
    []
  )

  const handleDecline = useCallback(
    (bookingId: string) => {
      setThreads((prev) =>
        prev.map((t) => {
          const updatedMessages = t.messages.map((m) => {
            if (
              m.type === "booking_request" &&
              m.bookingRequestData?.bookingId === bookingId
            ) {
              return {
                ...m,
                bookingRequestData: {
                  ...m.bookingRequestData,
                  status: "declined" as const,
                },
              }
            }
            return m
          })

          const hasDecline = updatedMessages.some(
            (m) =>
              m.type === "booking_request" &&
              m.bookingRequestData?.bookingId === bookingId
          )

          if (hasDecline) {
            const systemMsg: MockMessage = {
              id: `m-sys-${Date.now()}`,
              bookingId: t.bookingId,
              senderId: "system",
              senderName: "Dhara Platform",
              content: "Booking has been declined. The guest has been notified.",
              type: "system",
              readAt: null,
              createdAt: new Date().toISOString(),
            }
            return {
              ...t,
              messages: [...updatedMessages, systemMsg],
              lastMessage: "Booking declined",
              lastMessageAt: systemMsg.createdAt,
              unreadCount: 0,
            }
          }
          return { ...t, messages: updatedMessages }
        })
      )
      toast.success("Booking declined. Guest has been notified.")
    },
    []
  )

  const pendingCount = threads.filter(hasPendingRequest).length

  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description={
          pendingCount > 0
            ? `${pendingCount} pending booking request${pendingCount > 1 ? "s" : ""}`
            : "Conversations with guests"
        }
      />

      <Card className="overflow-hidden">
        <div className="flex h-[600px] flex-col md:flex-row">
          <div
            className={cn(
              "w-full border-b md:w-80 md:shrink-0 md:border-b-0 md:border-r",
              selectedThreadId && "hidden md:block"
            )}
          >
            <ScrollArea className="h-full">
              <div className="p-2">
                {threads.map((thread) => {
                  const guestName = getGuestNameForThread(
                    thread.bookingId,
                    thread.messages
                  )
                  const bookingCode = getBookingCode(thread.bookingId)
                  const pending = hasPendingRequest(thread)
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60",
                        selectedThreadId === thread.id && "bg-muted",
                        pending && "ring-1 ring-amber-300 bg-amber-50/50 dark:bg-amber-950/10"
                      )}
                    >
                      <Avatar className="mt-0.5 h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(guestName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {guestName}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {pending && (
                              <Badge className="bg-amber-100 text-amber-800 border-transparent text-[9px] px-1.5 py-0 dark:bg-amber-900/40 dark:text-amber-400">
                                Request
                              </Badge>
                            )}
                            {thread.unreadCount > 0 && (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                {thread.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {bookingCode}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {thread.lastMessage}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {format(
                            new Date(thread.lastMessageAt),
                            "MMM d, h:mm a"
                          )}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <div
            className={cn(
              "flex flex-1 flex-col",
              !selectedThreadId && "hidden md:flex"
            )}
          >
            {selectedThread ? (
              <>
                <div className="flex items-center gap-3 border-b px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSelectedThreadId(null)}
                  >
                    &larr;
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(
                        getGuestNameForThread(
                          selectedThread.bookingId,
                          selectedThread.messages
                        )
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">
                      {getGuestNameForThread(
                        selectedThread.bookingId,
                        selectedThread.messages
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getBookingCode(selectedThread.bookingId)}
                    </p>
                  </div>
                </div>

                <ScrollArea className="flex-1 px-4 py-4">
                  <div className="space-y-4">
                    {selectedThread.messages.map((msg) => {
                      if (msg.type === "booking_request") {
                        return (
                          <BookingRequestMessage
                            key={msg.id}
                            message={msg}
                            onApprove={handleApprove}
                            onDecline={handleDecline}
                            actionsDisabled={!canAct}
                          />
                        )
                      }

                      if (msg.type === "system") {
                        return (
                          <div
                            key={msg.id}
                            className="flex flex-col items-center gap-1"
                          >
                            <div className="rounded-full bg-muted px-4 py-1.5 text-xs text-muted-foreground text-center max-w-[80%]">
                              {msg.content}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {format(
                                new Date(msg.createdAt),
                                "MMM d, h:mm a"
                              )}
                            </p>
                          </div>
                        )
                      }

                      const isMe = msg.senderId === mockOperatorProfile.id
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex flex-col gap-1",
                            isMe ? "items-end" : "items-start"
                          )}
                        >
                          <p className="text-[10px] font-medium text-muted-foreground">
                            {msg.senderName}
                          </p>
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                              isMe ? "bg-primary/10" : "bg-muted"
                            )}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {format(
                              new Date(msg.createdAt),
                              "MMM d, h:mm a"
                            )}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <Separator />

                <div className="flex items-center gap-2 p-3">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!messageInput.trim() || !canAct}
                    title={!canAct ? "You don't have permission to perform this action" : undefined}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden flex-1 items-center justify-center md:flex">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="mx-auto mb-2 h-10 w-10" />
                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function OperatorMessagesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
      <OperatorMessagesContent />
    </React.Suspense>
  )
}
