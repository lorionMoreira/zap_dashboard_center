const envMockAuth = import.meta.env.VITE_MOCK_AUTH

export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8086',
  authBearerToken: import.meta.env.VITE_AUTH_BEARER_TOKEN || '',
  mockAuth: envMockAuth === 'true',
  timeout: 30000,
}
