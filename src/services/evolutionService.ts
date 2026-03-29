import axios from 'axios'

const evolutionApiUrl = import.meta.env.VITE_EVOLUTION_API_URL || 'http://evolution-api:8080'
const evolutionApiKey = import.meta.env.VITE_EVOLUTION_API_KEY || ''

const evolutionClient = axios.create({
  baseURL: evolutionApiUrl,
  headers: {
    'Content-Type': 'application/json',
    apikey: evolutionApiKey,
  },
})

export interface CreateInstanceResponse {
  instance: {
    instanceName: string
    status: string
  }
  hash: {
    apikey: string
  }
  qrcode?: {
    code: string
    base64: string
  }
}

export interface ConnectionStateResponse {
  instance: {
    instanceName: string
    state: string
  }
}

export const evolutionService = {
  /**
   * Creates a new instance in Evolution API v2 and returns the QR Code.
   */
  async createInstance(instanceName: string): Promise<CreateInstanceResponse> {
    const response = await evolutionClient.post<CreateInstanceResponse>('/instance/create', {
      instanceName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    })
    console.log(response.data)
    return response.data
  },

  /**
   * Connects an existing instance and retrieves the QR Code again if it's disconnected.
   */
  async connectInstance(instanceName: string) {
    const response = await evolutionClient.get(`/instance/connect/${instanceName}`)
    return response.data
  },

  /**
   * Gets the connection state of the instance.
   */
  async getConnectionState(instanceName: string): Promise<ConnectionStateResponse> {
    const response = await evolutionClient.get<ConnectionStateResponse>(`/instance/connectionState/${instanceName}`)
    return response.data
  },

  /**
   * Logs out / deletes the connection for the instance.
   */
  async logoutInstance(instanceName: string) {
    const response = await evolutionClient.delete(`/instance/logout/${instanceName}`)
    return response.data
  },
}
