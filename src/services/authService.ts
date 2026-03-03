import { apiConfig } from '../config/api'

interface User {
  id: string
  name: string
  email: string
}

interface LoginResponse {
  user: User
  token: string
}

interface RegisterResponse {
  user: User
  token: string
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'auth_user'

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha ao fazer login')
      }

      const data: LoginResponse = await response.json()
      
      // Store token and user
      localStorage.setItem(this.TOKEN_KEY, data.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))
      
      return data.user
    } catch (error) {
      // For development: simulate login without API
      if (apiConfig.mockAuth) {
        const mockUser: User = {
          id: '1',
          name: 'Usuário Demo',
          email: email,
        }
        localStorage.setItem(this.TOKEN_KEY, 'mock-token-' + Date.now())
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser))
        return mockUser
      }
      
      throw error
    }
  }

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Falha ao criar conta')
      }

      const data: RegisterResponse = await response.json()
      
      // Store token and user
      localStorage.setItem(this.TOKEN_KEY, data.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))
      
      return data.user
    } catch (error) {
      // For development: simulate registration without API
      if (apiConfig.mockAuth) {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          email: email,
        }
        localStorage.setItem(this.TOKEN_KEY, 'mock-token-' + Date.now())
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser))
        return mockUser
      }
      
      throw error
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem(this.USER_KEY)
    const token = localStorage.getItem(this.TOKEN_KEY)
    
    if (!userStr || !token) {
      return null
    }

    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }
}

export const authService = new AuthService()
