'use client'

export interface Circle {
  id: string
  name: string
  description: string
  coverColor: string
  category: string
  authorId: string
  authorName: string
  members: string[]
  moderators: string[]
  tags: string[]
  visibility: "public" | "private"
  postCount: number
  createdAt: string
  updatedAt: string
}

export interface CircleInvite {
  id: string
  circleId: string
  circleName: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  message?: string
  status: "pending" | "accepted" | "declined"
  createdAt: string
}

const CIRCLES_KEY = "zafiro_circles"
const INVITES_KEY = "zafiro_circle_invites"

function getCircles(): Circle[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(CIRCLES_KEY) || "[]") }
  catch { return [] }
}
function saveCircles(c: Circle[]) { localStorage.setItem(CIRCLES_KEY, JSON.stringify(c)) }

function getInvites(): CircleInvite[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(INVITES_KEY) || "[]") }
  catch { return [] }
}
function saveInvites(i: CircleInvite[]) { localStorage.setItem(INVITES_KEY, JSON.stringify(i)) }

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const COVERS = [
  "from-[#00D9FF] to-blue-600",
  "from-purple-500 to-pink-500",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-red-600",
  "from-cyan-400 to-indigo-600",
  "from-fuchsia-400 to-violet-600",
  "from-lime-400 to-green-600",
]

export function getCircleCover(index: number): string {
  return COVERS[index % COVERS.length]
}

export function createCircle(c: {
  name: string; description: string; category?: string; tags?: string[]
  authorId: string; authorName: string; visibility?: "public" | "private"
}): Circle {
  const circle: Circle = {
    id: genId("c"), name: c.name, description: c.description,
    coverColor: getCircleCover(Date.now()),
    category: c.category || "General", tags: c.tags || [],
    authorId: c.authorId, authorName: c.authorName,
    members: [c.authorId], moderators: [c.authorId],
    visibility: c.visibility || "public",
    postCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }
  const all = getCircles()
  all.unshift(circle)
  saveCircles(all)
  return circle
}

export function getCircle(id: string): Circle | undefined {
  return getCircles().find(c => c.id === id)
}

export function getCirclesList(filters?: { category?: string; search?: string; memberId?: string }): Circle[] {
  let list = getCircles()
  if (filters?.memberId) list = list.filter(c => c.members.includes(filters.memberId!))
  if (filters?.category) list = list.filter(c => c.category === filters.category)
  if (filters?.search) {
    const s = filters.search.toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s))
  }
  return list.sort((a, b) => b.members.length - a.members.length || b.postCount - a.postCount)
}

export function joinCircle(circleId: string, userId: string): boolean {
  const all = getCircles()
  const c = all.find(x => x.id === circleId)
  if (!c || c.members.includes(userId)) return false
  c.members.push(userId)
  c.updatedAt = new Date().toISOString()
  saveCircles(all)
  return true
}

export function leaveCircle(circleId: string, userId: string): boolean {
  const all = getCircles()
  const c = all.find(x => x.id === circleId)
  if (!c || c.authorId === userId) return false
  const idx = c.members.indexOf(userId)
  if (idx === -1) return false
  c.members.splice(idx, 1)
  c.updatedAt = new Date().toISOString()
  saveCircles(all)
  return true
}

export function addModerator(circleId: string, adminId: string, userId: string): boolean {
  const all = getCircles()
  const c = all.find(x => x.id === circleId)
  if (!c || c.authorId !== adminId) return false
  if (!c.members.includes(userId) || c.moderators.includes(userId)) return false
  c.moderators.push(userId)
  saveCircles(all)
  return true
}

export function removeModerator(circleId: string, adminId: string, userId: string): boolean {
  const all = getCircles()
  const c = all.find(x => x.id === circleId)
  if (!c || c.authorId !== adminId) return false
  const idx = c.moderators.indexOf(userId)
  if (idx === -1) return false
  c.moderators.splice(idx, 1)
  saveCircles(all)
  return true
}

export function removeMember(circleId: string, adminId: string, userId: string): boolean {
  const all = getCircles()
  const c = all.find(x => x.id === circleId)
  if (!c) return false
  if (c.authorId !== adminId && !c.moderators.includes(adminId)) return false
  if (userId === c.authorId) return false
  const mi = c.members.indexOf(userId)
  if (mi === -1) return false
  c.members.splice(mi, 1)
  const mdi = c.moderators.indexOf(userId)
  if (mdi !== -1) c.moderators.splice(mdi, 1)
  saveCircles(all)
  return true
}

export function incrementPostCount(circleId: string): boolean {
  const all = getCircles()
  const c = all.find(x => x.id === circleId)
  if (!c) return false
  c.postCount++
  c.updatedAt = new Date().toISOString()
  saveCircles(all)
  return true
}

export function deleteCircle(circleId: string, userId: string): boolean {
  const all = getCircles()
  const idx = all.findIndex(c => c.id === circleId && c.authorId === userId)
  if (idx === -1) return false
  all.splice(idx, 1)
  saveCircles(all)
  return true
}

export function getCategories(): string[] {
  const cats = new Set(getCircles().map(c => c.category))
  return ["General", "Tecnología", "Arte", "Música", "Ciencia", "Negocios", "Fe", "Familia", "Deportes", "Educación", "Otro"]
    .filter(c => c)
}

export function sendCircleInvite(invite: {
  circleId: string; circleName: string; fromUserId: string; fromUserName: string; toUserId: string; message?: string
}): CircleInvite {
  const inv: CircleInvite = {
    id: genId("inv"), circleId: invite.circleId, circleName: invite.circleName,
    fromUserId: invite.fromUserId, fromUserName: invite.fromUserName,
    toUserId: invite.toUserId, message: invite.message,
    status: "pending", createdAt: new Date().toISOString(),
  }
  const all = getInvites()
  all.unshift(inv)
  saveInvites(all)
  return inv
}

export function getCircleInvites(userId: string, status?: "pending" | "accepted" | "declined"): CircleInvite[] {
  let list = getInvites().filter(i => i.toUserId === userId)
  if (status) list = list.filter(i => i.status === status)
  return list
}

export function respondToInvite(inviteId: string, accept: boolean): boolean {
  const all = getInvites()
  const inv = all.find(i => i.id === inviteId)
  if (!inv || inv.status !== "pending") return false
  inv.status = accept ? "accepted" : "declined"
  saveInvites(all)
  if (accept) joinCircle(inv.circleId, inv.toUserId)
  return true
}

export function getCircleStats(): { total: number; members: number; categories: number } {
  const all = getCircles()
  return {
    total: all.length,
    members: all.reduce((s, c) => s + c.members.length, 0),
    categories: new Set(all.map(c => c.category)).size,
  }
}
