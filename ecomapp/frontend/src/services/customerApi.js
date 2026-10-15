import axios from 'axios'

const customerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/customers',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default customerApi
