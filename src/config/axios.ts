import axios from 'axios'
import { apiConfig } from './api'

const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (apiConfig.authBearerToken) {
      config.headers.Authorization = `Bearer ${apiConfig.authBearerToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
