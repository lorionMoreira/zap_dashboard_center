import { isAxiosError } from 'axios'
import { apiConfig } from '../config/api'
import apiClient from '../config/axios'
import { AuthApiResponse, User } from '../interfaces/auth'

class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'auth_user'

  private getAxiosErrorMessage(error: unknown, fallbackMessage: string): string {
    if (!isAxiosError(error)) {
      return fallbackMessage
    }

    const data = error.response?.data as { message?: string; error?: string } | undefined
    return data?.message || data?.error || error.message || fallbackMessage
  }

  private mapApiResponseToUser(data: AuthApiResponse, fallbackEmail = ''): User {
    return {
      id: data.username,
      name: data.username,
      username: data.username,
      email: data.email || fallbackEmail,
      salt: data.salt,
      loginComplete: data.loginComplete,
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post<AuthApiResponse>(
        '/api/auth/login',
        { email, password },
      )

      const data = response.data
      const user = this.mapApiResponseToUser(data)

      localStorage.setItem(this.TOKEN_KEY, data.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

      return user
    } catch (error) {
      if (apiConfig.mockAuth) {
        const mockUser: User = {
          id: email,
          name: email.split('@')[0],
          username: email.split('@')[0],
          email,
          loginComplete: true,
        }
        localStorage.setItem(this.TOKEN_KEY, `mock-token-${Date.now()}`)
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser))
        return mockUser
      }

      throw new Error(this.getAxiosErrorMessage(error, 'Falha ao fazer login'))
    }
  }

  async register(username: string, email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post<AuthApiResponse>(
        '/api/auth/register',
        { username, password, email },
      )

      const data = response.data
      const user = this.mapApiResponseToUser(data, email)

      localStorage.setItem(this.TOKEN_KEY, data.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))

      return user
    } catch (error) {
      if (apiConfig.mockAuth) {
        const mockUser: User = {
          id: username,
          name: username,
          username,
          email,
          loginComplete: false,
        }
        localStorage.setItem(this.TOKEN_KEY, `mock-token-${Date.now()}`)
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser))
        return mockUser
      }

      throw new Error(this.getAxiosErrorMessage(error, 'Falha ao criar conta'))
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

  updateUser(data: Partial<User>): User | null {
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr) return null
    try {
      const user = JSON.parse(userStr) as User
      const updatedUser = { ...user, ...data }
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser))
      return updatedUser
    } catch {
      return null
    }
  }

  async completeOnboarding(data: Record<string, unknown>): Promise<void> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        '/api/onboarding/complete',
        data,
      )

      if (!response.data.success) {
        throw new Error('Falha ao completar onboarding')
      }

      this.updateUser({ loginComplete: true })
    } catch (error) {
      throw new Error(this.getAxiosErrorMessage(error, 'Falha ao completar onboarding'))
    }
  }
}

export const authService = new AuthService()
