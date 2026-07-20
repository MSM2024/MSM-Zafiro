'use client'

import { enqueueOperation } from '@/lib/offline-queue'

export type PostVisibility = "public" | "circle" | "followers"

export interface FeedPost {
  id: string
  authorId: string
  authorName: string
  authorUsername?: string
  authorAvatar?: string
  text: string
  imageUrls: string[]
  visibility: PostVisibility
  circleId?: string
  tags: string[]
  likes: string[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
  pinned: boolean
  reported: boolean
  reportReason?: string
  blocked: boolean
}

export interface Comment {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  text: string
  likes: string[]
  createdAt: string
}

const POSTS_KEY = "zafiro_feed_posts"

function getPosts(): FeedPost[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]") }
  catch { return [] }
}

function savePosts(posts: FeedPost[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function createPost(post: {
  authorId: string; authorName: string; authorUsername?: string; authorAvatar?: string
  text: string; imageUrls?: string[]; visibility?: PostVisibility; tags?: string[]
}): FeedPost {
  const now = new Date().toISOString()
  const newPost: FeedPost = {
    id: generateId(), authorId: post.authorId, authorName: post.authorName,
    authorUsername: post.authorUsername, authorAvatar: post.authorAvatar,
    text: post.text, imageUrls: post.imageUrls || [], visibility: post.visibility || "public",
    tags: post.tags || [], likes: [], comments: [], createdAt: now, updatedAt: now,
    pinned: false, reported: false, blocked: false,
  }
  const posts = getPosts()
  posts.unshift(newPost)
  savePosts(posts)

  enqueueOperation({
    entity: "post",
    entityId: newPost.id,
    type: "create",
    data: newPost,
  })

  return newPost
}

export function getFeed(userId?: string, page = 0, pageSize = 10): { posts: FeedPost[]; total: number } {
  let posts = getPosts().filter(p => !p.blocked)
  if (userId) {
    posts = posts.filter(p => p.authorId === userId || p.likes.includes(userId) || p.comments.some(c => c.authorId === userId))
  }
  const total = posts.length
  const sliced = posts.slice(page * pageSize, (page + 1) * pageSize)
  return { posts: sliced, total }
}

export function getPost(postId: string): FeedPost | undefined {
  return getPosts().find(p => p.id === postId)
}

export function toggleLike(postId: string, userId: string): FeedPost | undefined {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return undefined
  const idx = post.likes.indexOf(userId)
  if (idx === -1) post.likes.push(userId)
  else post.likes.splice(idx, 1)
  post.updatedAt = new Date().toISOString()
  savePosts(posts)
  return post
}

export function addComment(postId: string, comment: { authorId: string; authorName: string; authorAvatar?: string; text: string }): FeedPost | undefined {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return undefined
  const newComment: Comment = {
    id: `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    authorId: comment.authorId, authorName: comment.authorName,
    authorAvatar: comment.authorAvatar, text: comment.text,
    likes: [], createdAt: new Date().toISOString(),
  }
  post.comments.push(newComment)
  post.updatedAt = newComment.createdAt
  savePosts(posts)
  return post
}

export function deletePost(postId: string, userId: string): boolean {
  const posts = getPosts()
  const idx = posts.findIndex(p => p.id === postId && p.authorId === userId)
  if (idx === -1) return false
  posts.splice(idx, 1)
  savePosts(posts)
  return true
}

export function reportPost(postId: string, reason: string): boolean {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return false
  post.reported = true
  post.reportReason = reason
  savePosts(posts)
  return true
}

export function blockPost(postId: string): boolean {
  const posts = getPosts()
  const post = posts.find(p => p.id === postId)
  if (!post) return false
  post.blocked = true
  savePosts(posts)
  return true
}

export function getFeedStats(): { totalPosts: number; totalComments: number; totalLikes: number } {
  const posts = getPosts()
  return {
    totalPosts: posts.length,
    totalComments: posts.reduce((s, p) => s + p.comments.length, 0),
    totalLikes: posts.reduce((s, p) => s + p.likes.length, 0),
  }
}
