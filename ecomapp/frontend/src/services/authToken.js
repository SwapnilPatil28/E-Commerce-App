// Fallback auth for cross-domain deploys (Vercel frontend + Render backend).
// The httpOnly cookie is the primary mechanism; when a browser blocks third-party
// cookies we send the same JWT as a Bearer header instead (backend accepts both).
const KEY = 'neomart_token'

export const getToken = () => {
  try { return localStorage.getItem(KEY) } catch { return null }
}

export const setToken = (token) => {
  try { token ? localStorage.setItem(KEY, token) : localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
}

export const attachAuthHeader = (client) => {
  client.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return client
}
