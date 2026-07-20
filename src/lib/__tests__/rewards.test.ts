import { describe, it, expect, beforeEach } from 'vitest'
import {
  earnPTS,
  spendPTS,
  getPTSAccount,
  getStreak,
  markDailyLogin,
  getEarnedBadges,
  checkAndAwardBadges,
  ACTION_REWARDS,
  BADGE_DEFS,
} from '../rewards'

beforeEach(() => { localStorage.clear() })

describe('rewards', () => {
  it('earnPTS adds points to user account', () => {
    const result = earnPTS('u1', 'create_question')
    expect(result.ok).toBe(true)
    expect(result.pts).toBe(100)
    const acct = getPTSAccount('u1')
    expect(acct.balance).toBe(100)
    expect(acct.totalEarned).toBe(100)
  })

  it('different reward actions give different points', () => {
    earnPTS('u1', 'create_question')
    earnPTS('u1', 'answer_question')
    earnPTS('u1', 'send_message')
    const acct = getPTSAccount('u1')
    expect(acct.balance).toBe(
      ACTION_REWARDS.create_question.pts +
      ACTION_REWARDS.answer_question.pts +
      ACTION_REWARDS.send_message.pts
    )
    expect(ACTION_REWARDS.create_sponsor_campaign.pts).toBe(500)
    expect(ACTION_REWARDS.daily_login.pts).toBe(25)
    expect(ACTION_REWARDS.send_message.pts).toBe(5)
  })

  it('earnPTS respects daily max limits', () => {
    const max = ACTION_REWARDS.daily_login.dailyMax
    for (let i = 0; i < max; i++) {
      expect(earnPTS('u1', 'daily_login').ok).toBe(true)
    }
    const result = earnPTS('u1', 'daily_login')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('Límite diario')
    const acct = getPTSAccount('u1')
    expect(acct.balance).toBe(ACTION_REWARDS.daily_login.pts * max)
  })

  it('spendPTS deducts balance', () => {
    earnPTS('u1', 'create_question')
    earnPTS('u1', 'create_question')
    const acct = getPTSAccount('u1')
    expect(acct.balance).toBe(200)
    const result = spendPTS('u1', 50, 'Buy badge')
    expect(result.ok).toBe(true)
    const after = getPTSAccount('u1')
    expect(after.balance).toBe(150)
    expect(after.totalSpent).toBe(50)
  })

  it('spendPTS fails with insufficient balance', () => {
    const result = spendPTS('u1', 100, 'Too much')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('insuficientes')
  })

  it('getPTSAccount returns level info', () => {
    const acct = getPTSAccount('u1')
    expect(acct.level).toBe(1)
    expect(acct.nextLevelAt).toBe(1000)
    expect(acct.levelProgress).toBe(0)
    earnPTS('u1', 'create_sponsor_campaign')
    const after = getPTSAccount('u1')
    expect(after.level).toBe(1)
    expect(after.levelProgress).toBe(50)
  })

  it('checkAndAwardBadges awards badges at thresholds', () => {
    earnPTS('u1', 'create_question')
    const badges = checkAndAwardBadges('u1')
    expect(badges).toContain('first_question')
    const earned = getEarnedBadges('u1')
    expect(earned).toContain('first_question')
  })

  it('checkAndAwardBadges does not re-award already earned badges', () => {
    earnPTS('u1', 'create_question')
    checkAndAwardBadges('u1')
    const firstRun = getEarnedBadges('u1')
    checkAndAwardBadges('u1')
    const secondRun = getEarnedBadges('u1')
    expect(firstRun.length).toBe(secondRun.length)
  })

  it('markDailyLogin increments streak', () => {
    const streak = markDailyLogin('u1')
    expect(streak).toBe(1)
    expect(getStreak('u1')).toBe(1)
    expect(getPTSAccount('u1').balance).toBeGreaterThan(0)
  })

  it('getStreak returns 0 for unknown user', () => {
    expect(getStreak('nonexistent')).toBe(0)
  })
})
