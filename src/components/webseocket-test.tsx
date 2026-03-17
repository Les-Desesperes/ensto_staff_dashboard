"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquareText, RefreshCw, Send, Wifi, WifiOff } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type WsPayload = Record<string, unknown> | string | number | boolean | null

interface WsMessage {
  type: string
  message?: string
  payload?: WsPayload
  data?: WsPayload
}

const websocketUrl = process.env.NEXT_PUBLIC_WS_URL

function formatLogContent(log: WsMessage) {
  return JSON.stringify(log.payload ?? log.message ?? log.data ?? log, null, 2)
}

function getLogBadgeClassName(type: string) {
  switch (type) {
    case "ERROR":
      return "border-destructive/30 bg-destructive/10 text-destructive"
    case "SYSTEM_READY":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    case "PONG":
      return "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
    default:
      return "border-border bg-muted text-foreground"
  }
}

export default function WebSocketTest() {
  const [isConnected, setIsConnected] = useState(false)
  const [logs, setLogs] = useState<WsMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(websocketUrl!)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("✅ Connected to Express WebSocket")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const rawData = typeof event.data === "string" ? event.data : String(event.data)
        const parsedData: WsMessage = JSON.parse(rawData)

        setLogs((prev) => [...prev, parsedData])

        switch (parsedData.type) {
          case "SYSTEM_READY":
            console.log("System is ready:", parsedData.message)
            break
          case "PONG":
            console.log("Server replied with PONG:", parsedData)
            break
          case "NEW_CHAT_MESSAGE":
            console.log("New chat received:", parsedData.payload)
            break
          case "NEW_DRIVER":
            console.log("Driver added to DB:", parsedData.data)
            break
          case "ERROR":
            console.error("Server error:", parsedData.message)
            break
          default:
            console.log("Unknown event received:", parsedData)
        }
      } catch {
        console.error("Failed to parse incoming message:", event.data)
      }
    }

    ws.onclose = () => {
      console.log("❌ Disconnected from Express WebSocket")
      setIsConnected(false)
    }

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [])

  const sendPing = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "PING" }))
    }
  }

  const sendChat = () => {
    const trimmedMessage = chatInput.trim()

    if (wsRef.current?.readyState === WebSocket.OPEN && trimmedMessage) {
      wsRef.current.send(
        JSON.stringify({
          type: "CHAT_MESSAGE",
          payload: { user: "Next.js Admin", text: trimmedMessage },
        })
      )
      setChatInput("")
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="gap-3 border-b">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="size-5 text-primary" />
              WebSocket Event Router Test
            </CardTitle>
            <CardDescription>
              Connect to your local WebSocket server, send test events, and inspect live payloads.
            </CardDescription>
          </div>
          <CardAction>
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 px-2 py-1",
                isConnected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              )}
            >
              {isConnected ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 rounded-xl border bg-muted/30 p-4 md:grid-cols-[auto_1fr]">
            <Button
              type="button"
              onClick={sendPing}
              disabled={!isConnected}
              className="w-full md:w-auto"
            >
              <RefreshCw className="size-4" />
              Send PING
            </Button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendChat()}
                placeholder="Type a chat message..."
                disabled={!isConnected}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={sendChat}
                disabled={!isConnected || !chatInput.trim()}
                className="w-full sm:w-auto"
              >
                <Send className="size-4" />
                Send Chat
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium">Live event log</h3>
                <p className="text-sm text-muted-foreground">
                  Listening on <span className="font-mono text-foreground">{websocketUrl}</span>
                </p>
              </div>
              <Badge variant="secondary">{logs.length} event{logs.length === 1 ? "" : "s"}</Badge>
            </div>

            <div className="h-87.5 overflow-y-auto rounded-xl border bg-muted/20 p-4">
              {logs.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/70 text-sm text-muted-foreground">
                  Waiting for events...
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <div key={`${log.type}-${index}`} className="rounded-lg border bg-background p-3 shadow-xs">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className={getLogBadgeClassName(log.type)}>
                          {log.type}
                        </Badge>
                      </div>
                      <pre className="overflow-x-auto rounded-md bg-muted/60 p-3 font-mono text-xs leading-5 whitespace-pre-wrap wrap-break-word text-foreground">
                        {formatLogContent(log)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-2 text-xs text-muted-foreground max-sm:flex-col max-sm:items-start">
          <span>Uses shadcn/ui primitives with Tailwind utilities only.</span>
          <span>Send a ping or chat message once the socket is connected.</span>
        </CardFooter>
      </Card>
    </div>
  )
}