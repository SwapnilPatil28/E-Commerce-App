import axios from 'axios'
import { attachAuthHeader } from './authToken'

const customerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/customers',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

attachAuthHeader(customerApi)

export default customerApi
