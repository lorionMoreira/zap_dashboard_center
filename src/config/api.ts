export const apiConfig = {
  // Change this to your actual API URL when ready
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Enable mock authentication for development without backend
  mockAuth: import.meta.env.VITE_MOCK_AUTH === 'true' || true,
  
  timeout: 30000, // 30 seconds
}
