// Swap this for a real fetch wrapper when the backend exists.
export const BASE = import.meta.env.VITE_API_URL || ''
export const mock = (data) => new Promise((r) => setTimeout(() => r(data), 0))
