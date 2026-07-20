'use client'

import { enqueueOperation } from '@/lib/offline-queue'
import { earnPTS } from '@/lib/rewards'

export interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  participants: string[]
  participantNames: Record<string, string>
  participantAvatars: Record<string, string>
  lastMessage?: string
  lastMessageTime?: string
  lastSenderId?: string
  unreadCount: number
  createdAt: string
}

const CONV_KEY = "zafiro_msg_conversations"
const MSG_PREFIX = "zafiro_msg_"

function getConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(CONV_KEY) || "[]") }
  catch { return [] }
}

function saveConversations(c: Conversation[]) { localStorage.setItem(CONV_KEY, JSON.stringify(c)) }

function getMessages(convId: string): Message[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(MSG_PREFIX + convId) || "[]") }
  catch { return [] }
}

function saveMessages(convId: string, msgs: Message[]) {
  localStorage.setItem(MSG_PREFIX + convId, JSON.stringify(msgs))
}

function genId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function getOrCreateConversation(user1Id: string, user2Id: string, names: Record<string, string>, avatars?: Record<string, string>): Conversation {
  const all = getConversations()
  const existing = all.find(c =>
    c.participants.includes(user1Id) && c.participants.includes(user2Id) && c.participants.length === 2
  )
  if (existing) return existing

  const conv: Conversation = {
    id: genId(),
    participants: [user1Id, user2Id],
    participantNames: { [user1Id]: names[user1Id] || user1Id, [user2Id]: names[user2Id] || user2Id },
    participantAvatars: avatars || {},
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  }
  all.unshift(conv)
  saveConversations(all)
  return conv
}

export function getUserConversations(userId: string): Conversation[] {
  return getConversations()
    .filter(c => c.participants.includes(userId))
    .sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) return 0
      if (!a.lastMessageTime) return 1
      if (!b.lastMessageTime) return -1
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    })
}

export function sendMessage(convId: string, senderId: string, senderName: string, text: string): Message {
  const msg: Message = {
    id: genId(), senderId, senderName, text,
    createdAt: new Date().toISOString(), read: false,
  }
  const msgs = getMessages(convId)
  msgs.push(msg)
  saveMessages(convId, msgs)

  const all = getConversations()
  const conv = all.find(c => c.id === convId)
  if (conv) {
    conv.lastMessage = text
    conv.lastMessageTime = msg.createdAt
    conv.lastSenderId = senderId
    all.forEach(c => {
      if (c.id !== convId && c.participants.includes(senderId)) return
      if (c.id === convId) return
    })
    conv.unreadCount = msgs.filter(m => m.senderId !== senderId && !m.read).length
    saveConversations(all)
  }

  try { earnPTS(senderId, "send_message") } catch {}

  enqueueOperation({
    entity: "message",
    entityId: msg.id,
    type: "create",
    data: { convId, message: msg },
  })

  return msg
}

export function getConversationMessages(convId: string): Message[] {
  return getMessages(convId)
}

export function markConversationRead(convId: string, userId: string) {
  const msgs = getMessages(convId)
  let changed = false
  msgs.forEach(m => {
    if (m.senderId !== userId && !m.read) { m.read = true; changed = true }
  })
  if (changed) {
    saveMessages(convId, msgs)
    const all = getConversations()
    const conv = all.find(c => c.id === convId)
    if (conv) { conv.unreadCount = 0; saveConversations(all) }
  }
}

export function getUnreadCount(userId: string): number {
  return getConversations()
    .filter(c => c.participants.includes(userId))
    .reduce((s, c) => s + c.unreadCount, 0)
}

export function getTotalMessagesSent(userId: string): number {
  let count = 0
  getConversations().filter(c => c.participants.includes(userId)).forEach(c => {
    count += getMessages(c.id).filter(m => m.senderId === userId).length
  })
  return count
}
