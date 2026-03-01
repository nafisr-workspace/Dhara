"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { mockThreads, mockBookings, mockOperatorProfile } from "@/lib/mock-data"
import { format } from "date-fns"
import { Send, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getGuestNameForThread(bookingId: string, messages: typeof mockThreads[0]["messages"]): string {
  const guestMessage = messages.find((m) => m.senderId !== mockOperatorProfile.id)
  if (guestMessage) return guestMessage.senderName
  const booking = mockBookings.find((b) => b.id === bookingId)
  return booking?.bookingCode ?? "Guest"
}

function getBookingCode(bookingId: string): string {
  const booking = mockBookings.find((b) => b.id === bookingId)
  return booking?.bookingCode ?? bookingId
}

export default function OperatorMessagesPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    mockThreads[0]?.id ?? null
  )
  const [messageInput, setMessageInput] = useState("")

  const selectedThread = mockThreads.find((t) => t.id === selectedThreadId)

  function handleSend() {
    if (!messageInput.trim()) return
    setMessageInput("")
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Messages" description="Conversations with guests" />

      <Card className="overflow-hidden">
        <div className="flex h-[600px] flex-col md:flex-row">
          {/* Left panel — thread list */}
          <div
            className={cn(
              "w-full border-b md:w-80 md:shrink-0 md:border-b-0 md:border-r",
              selectedThreadId && "hidden md:block"
            )}
          >
            <ScrollArea className="h-full">
              <div className="p-2">
                {mockThreads.map((thread) => {
                  const guestName = getGuestNameForThread(thread.bookingId, thread.messages)
                  const bookingCode = getBookingCode(thread.bookingId)
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/60",
                        selectedThreadId === thread.id && "bg-muted"
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
                          {thread.unreadCount > 0 && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {bookingCode}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {thread.lastMessage}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {format(new Date(thread.lastMessageAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right panel — message thread */}
          <div
            className={cn(
              "flex flex-1 flex-col",
              !selectedThreadId && "hidden md:flex"
            )}
          >
            {selectedThread ? (
              <>
                {/* Thread header */}
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
                        getGuestNameForThread(selectedThread.bookingId, selectedThread.messages)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">
                      {getGuestNameForThread(selectedThread.bookingId, selectedThread.messages)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getBookingCode(selectedThread.bookingId)}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-4">
                  <div className="space-y-4">
                    {selectedThread.messages.map((msg) => {
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
                            {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <Separator />

                {/* Input area */}
                <div className="flex items-center gap-2 p-3">
                  <Input
                    placeholder="Type a message…"
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
                    disabled={!messageInput.trim()}
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
