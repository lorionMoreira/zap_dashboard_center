export interface User {
  id: string
  name: string
  username: string
  email: string
  salt?: string
  loginComplete?: boolean
}

export interface AuthApiResponse {
  token: string
  username: string
  salt?: string
  email?: string
  loginComplete?: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
