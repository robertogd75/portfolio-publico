import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'rgardel_chat_v1'
const TTL_MS      = 24 * 60 * 60 * 1000 // 24 h

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const { messages, savedAt } = JSON.parse(raw)
    if (Date.now() - savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    return Array.isArray(messages) ? messages : []
  } catch {
    return []
  }
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, savedAt: Date.now() }))
  } catch { /* storage full or unavailable */ }
}

const ChatCtx = createContext(null)

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => loadMessages())
  const [loading, setLoading]   = useState(false)

  // Persist whenever messages change
  useEffect(() => { saveMessages(messages) }, [messages])

  // Keep a ref so sendMessage always sees latest messages without stale closure
  const messagesRef = useRef(messages)
  useEffect(() => { messagesRef.current = messages }, [messages])

  const resetChat = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([])
  }, [])

  const sendMessage = useCallback(async (text, { errorText, rateLimitText }) => {
    const trimmed = text.trim().slice(0, 500)
    if (!trimmed || loading) return

    // Snapshot history before adding the new user message
    const historySnapshot = messagesRef.current
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: historySnapshot }),
      })
      const data = await res.json()
      const reply = !res.ok
        ? (res.status === 429 ? rateLimitText : (data.error ?? errorText))
        : data.reply
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: errorText }])
    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <ChatCtx.Provider value={{ messages, loading, sendMessage, resetChat }}>
      {children}
    </ChatCtx.Provider>
  )
}

export function useChat() {
  return useContext(ChatCtx)
}
