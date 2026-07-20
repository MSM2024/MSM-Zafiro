import { describe, it, expect, beforeEach } from 'vitest'
import { createPost, getFeed, getFeedStats, toggleLike, addComment, deletePost, getPost } from '../feed'

beforeEach(() => { localStorage.clear() })

describe('feed', () => {
  it('creates a post and retrieves it', () => {
    const p = createPost({ authorId: 'u1', authorName: 'User1', text: 'Hello world' })
    expect(p.text).toBe('Hello world')
    expect(p.authorId).toBe('u1')
    expect(p.likes).toEqual([])
    expect(p.comments).toEqual([])
    const feed = getFeed()
    expect(feed.posts).toHaveLength(1)
  })

  it('getFeedStats returns correct counts', () => {
    createPost({ authorId: 'u1', authorName: 'U1', text: 'Post 1' })
    createPost({ authorId: 'u2', authorName: 'U2', text: 'Post 2' })
    const stats = getFeedStats()
    expect(stats.totalPosts).toBe(2)
  })

  it('toggleLike adds/removes user from likes', () => {
    const p = createPost({ authorId: 'u1', authorName: 'U1', text: 'Test' })
    toggleLike(p.id, 'user1')
    expect(getPost(p.id)?.likes).toContain('user1')
    toggleLike(p.id, 'user1')
    expect(getPost(p.id)?.likes).not.toContain('user1')
  })

  it('addComment adds a comment', () => {
    const p = createPost({ authorId: 'u1', authorName: 'U1', text: 'Test' })
    addComment(p.id, { authorId: 'u2', authorName: 'U2', text: 'Nice!' })
    const updated = getPost(p.id)
    expect(updated?.comments).toHaveLength(1)
    expect(updated?.comments[0].text).toBe('Nice!')
  })

  it('deletePost removes the post', () => {
    const p = createPost({ authorId: 'u1', authorName: 'U1', text: 'Test' })
    deletePost(p.id, 'u1')
    expect(getFeed().posts).toHaveLength(0)
  })

  it('getFeed filters by userId', () => {
    createPost({ authorId: 'u1', authorName: 'U1', text: 'Post 1' })
    createPost({ authorId: 'u1', authorName: 'U1', text: 'Post 2' })
    const feed = getFeed('u1')
    expect(feed.posts).toHaveLength(2)
    const empty = getFeed('other')
    expect(empty.posts).toHaveLength(0)
  })
})
