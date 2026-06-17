import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL

axios.defaults.baseURL = API_URL
axios.defaults.withCredentials = true

export default axios
