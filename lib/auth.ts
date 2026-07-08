// Simple password-based auth for 3 users
const USERS = {
  Míša: 'Mrkev123',
  Sembi: 'SembiJeGoat',
  Kuba: 'MessiGarnacho',
}

export const checkAuth = (password: string): string | null => {
  for (const [name, pwd] of Object.entries(USERS)) {
    if (password === pwd) return name
  }
  return null
}

export const setAuthToken = (userName: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('match_auth', userName)
  }
}

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('match_auth')
  }
}

export const getAuthUser = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('match_auth')
  }
  return null
}

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('match_auth')
  }
  return false
}
