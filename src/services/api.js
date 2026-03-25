export const SYSTEM_API_BASE_URL =
  import.meta.env.VITE_SYSTEM_API_BASE_URL || 'https://harmony-system-backend.onrender.com'

export const MATCH_API_BASE_URL =
  import.meta.env.VITE_MATCH_API_BASE_URL || 'https://harmony-backend-matching.onrender.com'

export function buildSystemApiUrl(path) {
  if (!path) return SYSTEM_API_BASE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${SYSTEM_API_BASE_URL}${path}`
  return `${SYSTEM_API_BASE_URL}/${path}`
}

export function buildMatchApiUrl(path) {
  if (!path) return MATCH_API_BASE_URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${MATCH_API_BASE_URL}${path}`
  return `${MATCH_API_BASE_URL}/${path}`
}