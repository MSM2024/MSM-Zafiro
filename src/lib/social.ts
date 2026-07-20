'use client'

export interface FollowRelation {
  followerId: string
  followingId: string
  createdAt: string
}

export interface BlockRelation {
  blockerId: string
  blockedId: string
  reason?: string
  createdAt: string
}

const FOLLOW_KEY = "zafiro_follows"
const BLOCK_KEY = "zafiro_blocks"

function getFollows(): FollowRelation[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(FOLLOW_KEY) || "[]") }
  catch { return [] }
}

function saveFollows(f: FollowRelation[]) { localStorage.setItem(FOLLOW_KEY, JSON.stringify(f)) }

function getBlocks(): BlockRelation[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(BLOCK_KEY) || "[]") }
  catch { return [] }
}

function saveBlocks(b: BlockRelation[]) { localStorage.setItem(BLOCK_KEY, JSON.stringify(b)) }

export function followUser(followerId: string, followingId: string): boolean {
  if (followerId === followingId) return false
  const follows = getFollows()
  if (follows.some(f => f.followerId === followerId && f.followingId === followingId)) return false
  follows.push({ followerId, followingId, createdAt: new Date().toISOString() })
  saveFollows(follows)
  return true
}

export function unfollowUser(followerId: string, followingId: string): boolean {
  const follows = getFollows()
  const idx = follows.findIndex(f => f.followerId === followerId && f.followingId === followingId)
  if (idx === -1) return false
  follows.splice(idx, 1)
  saveFollows(follows)
  return true
}

export function isFollowing(followerId: string, followingId: string): boolean {
  return getFollows().some(f => f.followerId === followerId && f.followingId === followingId)
}

export function getFollowers(userId: string): string[] {
  return getFollows().filter(f => f.followingId === userId).map(f => f.followerId)
}

export function getFollowing(userId: string): string[] {
  return getFollows().filter(f => f.followerId === userId).map(f => f.followingId)
}

export function getFollowerCount(userId: string): number { return getFollowers(userId).length }
export function getFollowingCount(userId: string): number { return getFollowing(userId).length }

export function blockUser(blockerId: string, blockedId: string, reason?: string): boolean {
  if (blockerId === blockedId) return false
  const blocks = getBlocks()
  if (blocks.some(b => b.blockerId === blockerId && b.blockedId === blockedId)) return false
  blocks.push({ blockerId, blockedId, reason, createdAt: new Date().toISOString() })
  saveBlocks(blocks)
  unfollowUser(blockerId, blockedId)
  return true
}

export function unblockUser(blockerId: string, blockedId: string): boolean {
  const blocks = getBlocks()
  const idx = blocks.findIndex(b => b.blockerId === blockerId && b.blockedId === blockedId)
  if (idx === -1) return false
  blocks.splice(idx, 1)
  saveBlocks(blocks)
  return true
}

export function isBlocked(blockerId: string, blockedId: string): boolean {
  return getBlocks().some(b => b.blockerId === blockerId && b.blockedId === blockedId)
}

export function getBlockedUsers(userId: string): string[] {
  return getBlocks().filter(b => b.blockerId === userId).map(b => b.blockedId)
}
