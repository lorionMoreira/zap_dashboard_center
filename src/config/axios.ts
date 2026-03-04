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

if (apiConfig.authBearerToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${apiConfig.authBearerToken}`
}

export default apiClient
