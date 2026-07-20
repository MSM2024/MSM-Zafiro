import { describe, it, expect, beforeEach } from 'vitest'
import {
  addNotification,
  getAllNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  PILLAR_LABELS,
  getPillarColor,
} from '../notifications'

beforeEach(() => { localStorage.clear() })

const sampleNotification = {
  title: 'Test Title',
  message: 'Test message body',
  type: 'info' as const,
  pillar: 'marketplace' as const,
  read: false,
  actionUrl: '/marketplace',
}

describe('notifications', () => {
  it('addNotification stores and returns notification with id and timestamp', () => {
    const n = addNotification(sampleNotification)
    expect(n.id).toBeDefined()
    expect(n.timestamp).toBeDefined()
    expect(n.title).toBe('Test Title')
    expect(n.message).toBe('Test message body')
    expect(n.pillar).toBe('marketplace')
    expect(n.read).toBe(false)
  })

  it('getAllNotifications returns stored notifications', () => {
    addNotification(sampleNotification)
    addNotification({ ...sampleNotification, title: 'Second', pillar: 'editorial' })
    const list = getAllNotifications()
    const stored = list.filter(n => n.id.startsWith('notif_'))
    expect(stored.length).toBeGreaterThanOrEqual(2)
  })

  it('markNotificationRead updates read status', () => {
    const n = addNotification(sampleNotification)
    expect(n.read).toBe(false)
    markNotificationRead(n.id)
    const list = getAllNotifications()
    const updated = list.find(x => x.id === n.id)
    expect(updated?.read).toBe(true)
  })

  it('markAllRead marks all stored notifications as read', () => {
    addNotification(sampleNotification)
    addNotification({ ...sampleNotification, title: 'Two' })
    addNotification({ ...sampleNotification, title: 'Three' })
    markAllRead()
    const stored = getAllNotifications().filter(n => n.id.startsWith('notif_'))
    expect(stored.every(n => n.read)).toBe(true)
  })

  it('deleteNotification removes the notification', () => {
    const n = addNotification(sampleNotification)
    addNotification({ ...sampleNotification, title: 'Keep' })
    deleteNotification(n.id)
    const stored = getAllNotifications().filter(n => n.id.startsWith('notif_'))
    expect(stored.find(x => x.id === n.id)).toBeUndefined()
    expect(stored).toHaveLength(1)
  })

  it('notifications have correct pillar and type fields', () => {
    const pillars = ['marketplace', 'editorial', 'economy', 'identity', 'sellos', 'system'] as const
    pillars.forEach(p => {
      addNotification({ title: `${p} notif`, message: 'msg', type: 'info', pillar: p, read: false })
    })
    const stored = getAllNotifications().filter(n => n.id.startsWith('notif_'))
    expect(stored).toHaveLength(pillars.length)
    pillars.forEach(p => {
      expect(stored.find(n => n.pillar === p)).toBeDefined()
    })
  })

  it('PILLAR_LABELS maps all pillars', () => {
    expect(PILLAR_LABELS.marketplace).toBe('Marketplace')
    expect(PILLAR_LABELS.editorial).toBe('Editorial')
    expect(PILLAR_LABELS.economy).toBe('Economía')
    expect(PILLAR_LABELS.identity).toBe('Identidad')
    expect(PILLAR_LABELS.sellos).toBe('Sellos')
    expect(PILLAR_LABELS.system).toBe('Sistema')
  })

  it('getPillarColor returns CSS classes for each pillar', () => {
    expect(getPillarColor('marketplace')).toContain('amber')
    expect(getPillarColor('editorial')).toContain('indigo')
    expect(getPillarColor('economy')).toContain('emerald')
    expect(getPillarColor('unknown')).toContain('slate')
  })
})
