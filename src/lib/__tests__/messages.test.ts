import { describe, it, expect, beforeEach } from 'vitest'
import {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  markConversationRead,
  getUnreadCount,
  getTotalMessagesSent,
} from '../messages'

beforeEach(() => { localStorage.clear() })

describe('messages', () => {
  it('getOrCreateConversation creates a new conversation', () => {
    const conv = getOrCreateConversation('u1', 'u2', { u1: 'Alice', u2: 'Bob' })
    expect(conv.id).toBeDefined()
    expect(conv.participants).toEqual(['u1', 'u2'])
    expect(conv.participantNames.u1).toBe('Alice')
    expect(conv.participantNames.u2).toBe('Bob')
    expect(conv.unreadCount).toBe(0)
  })

  it('getOrCreateConversation returns existing conversation', () => {
    const c1 = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    const c2 = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    expect(c1.id).toBe(c2.id)
  })

  it('sendMessage adds a message to the conversation', () => {
    const conv = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    const msg = sendMessage(conv.id, 'u1', 'Alice', 'Hello!')
    expect(msg.text).toBe('Hello!')
    expect(msg.senderId).toBe('u1')
    expect(msg.read).toBe(false)
    const msgs = getConversationMessages(conv.id)
    expect(msgs).toHaveLength(1)
    expect(msgs[0].text).toBe('Hello!')
  })

  it('sendMessage updates conversation lastMessage', () => {
    const conv = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    sendMessage(conv.id, 'u1', 'Alice', 'Hi there')
    const updated = getUserConversations('u1').find(c => c.id === conv.id)
    expect(updated?.lastMessage).toBe('Hi there')
    expect(updated?.lastSenderId).toBe('u1')
  })

  it('getUserConversations returns user conversations sorted by lastMessageTime', () => {
    const c1 = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    const c2 = getOrCreateConversation('u1', 'u3', { u1: 'A', u3: 'C' })
    sendMessage(c1.id, 'u1', 'A', 'Older message')
    sendMessage(c2.id, 'u1', 'A', 'Newer message')
    const convos = getUserConversations('u1')
    expect(convos).toHaveLength(2)
    const ids = convos.map(c => c.id)
    expect(ids).toContain(c1.id)
    expect(ids).toContain(c2.id)
    expect(convos[0].lastMessage).toBe('Newer message')
  })

  it('markConversationRead updates read status and unreadCount', () => {
    const conv = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    sendMessage(conv.id, 'u1', 'Alice', 'First')
    sendMessage(conv.id, 'u1', 'Alice', 'Second')
    sendMessage(conv.id, 'u2', 'Bob', 'Reply')
    expect(getUnreadCount('u1')).toBe(2)
    markConversationRead(conv.id, 'u1')
    expect(getUnreadCount('u1')).toBe(0)
    const msgs = getConversationMessages(conv.id)
    const otherMsgs = msgs.filter(m => m.senderId !== 'u1')
    expect(otherMsgs.every(m => m.read)).toBe(true)
  })

  it('getUnreadCount aggregates across conversations', () => {
    const c1 = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    const c2 = getOrCreateConversation('u1', 'u3', { u1: 'A', u3: 'C' })
    sendMessage(c1.id, 'u1', 'A', 'Sent first')
    sendMessage(c1.id, 'u2', 'B', 'Reply')
    sendMessage(c2.id, 'u1', 'A', 'Sent first')
    sendMessage(c2.id, 'u3', 'C', 'Reply')
    expect(getUnreadCount('u1')).toBe(2)
  })

  it('getTotalMessagesSent counts messages by user', () => {
    const conv = getOrCreateConversation('u1', 'u2', { u1: 'A', u2: 'B' })
    sendMessage(conv.id, 'u1', 'A', 'M1')
    sendMessage(conv.id, 'u2', 'B', 'M2')
    sendMessage(conv.id, 'u1', 'A', 'M3')
    expect(getTotalMessagesSent('u1')).toBe(2)
    expect(getTotalMessagesSent('u2')).toBe(1)
  })
})
