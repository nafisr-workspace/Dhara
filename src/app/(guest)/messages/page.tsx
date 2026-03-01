"use client"

import React, { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { mockThreads, mockGuestProfile } from "@/lib/mock-data"
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

export default function MessagesPage() {
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
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <PageHeader title="Messages" description="Your conversations" />

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
                {mockThreads.map((thread) => (
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
                        {getInitials(thread.facilityName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {thread.facilityName}
                        </p>
                        {thread.unreadCount > 0 && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {thread.lastMessage}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {format(new Date(thread.lastMessageAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </button>
                ))}
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
                      {getInitials(selectedThread.facilityName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-semibold">
                    {selectedThread.facilityName}
                  </p>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-4">
                  <div className="space-y-4">
                    {selectedThread.messages.map((msg) => {
                      const isMe = msg.senderId === mockGuestProfile.id
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
                  <Button size="icon" onClick={handleSend} disabled={!messageInput.trim()}>
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
    </main>
  )
}
