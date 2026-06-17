import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || ''
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL || undefined

axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

export default axios
