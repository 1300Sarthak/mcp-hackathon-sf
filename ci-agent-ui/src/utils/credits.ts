// Credit management for guest users
const STORAGE_KEY = 'info_ninja_guest_credits'
const DAILY_CREDITS = 10

interface CreditData {
  credits: number
  lastReset: string // ISO date string
}

export function getGuestCredits(): number {
  const stored = localStorage.getItem(STORAGE_KEY)
  
  if (!stored) {
    // First time user
    resetCredits()
    return DAILY_CREDITS
  }

  try {
    const data: CreditData = JSON.parse(stored)
    const lastReset = new Date(data.lastReset)
    const today = new Date()
    
    // Check if it's a new day (reset at midnight)
    if (
      lastReset.getDate() !== today.getDate() ||
      lastReset.getMonth() !== today.getMonth() ||
      lastReset.getFullYear() !== today.getFullYear()
    ) {
      // New day, reset credits
      resetCredits()
      return DAILY_CREDITS
    }
    
    return data.credits
  } catch {
    // Invalid data, reset
    resetCredits()
    return DAILY_CREDITS
  }
}

export function useCredit(): boolean {
  const credits = getGuestCredits()
  
  if (credits <= 0) {
    return false
  }
  
  const newCredits = credits - 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    credits: newCredits,
    lastReset: new Date().toISOString()
  }))
  
  return true
}

export function resetCredits(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    credits: DAILY_CREDITS,
    lastReset: new Date().toISOString()
  }))
}

export function getRemainingCredits(): number {
  return getGuestCredits()
}

