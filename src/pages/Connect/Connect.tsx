import { useState, useEffect, useRef } from 'react'
import './Connect.css'
import { evolutionService } from '../../services/evolutionService'

export default function Connect() {
  const [instanceName, setInstanceName] = useState('dispositivo-1')
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const pollingIntervalRef = useRef<number | null>(null)

  // Polling function to check connection status
  const startPolling = (name: string) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)

    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const stateData = await evolutionService.getConnectionState(name)
        if (stateData.instance.state === 'open') {
          setConnected(true)
          setQrCodeData(null) // Hide QR code if connected
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
        }
      } catch (err) {
        // Just ignore errors during polling and try again next tick
        console.error('Error polling connection state:', err)
      }
    }, 5000) // Poll every 5 seconds
  }

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
  }, [])

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!instanceName.trim()) {
      setError('Por favor, digite um nome para o dispositivo.')
      return
    }

    setLoading(true)
    setError(null)
    setConnected(false)
    setQrCodeData(null)

    try {
      // Create or try to get QR code for existing instance
      const response = await evolutionService.createInstance(instanceName)

      if (response.qrcode && response.qrcode.base64) {
        setQrCodeData(response.qrcode.base64)
        startPolling(instanceName)
      } else if (response.instance.status === 'open') {
        setConnected(true)
      } else {
        // If no QR code and not connected, we might need to call connectInstance
        const connectResponse = await evolutionService.connectInstance(instanceName)
        if (connectResponse.base64) {
          // If the backend returns base64 directly on connect endpoint
          setQrCodeData(connectResponse.base64)
          startPolling(instanceName)
        } else if (connectResponse.instance?.state === 'open') {
          setConnected(true)
        } else {
          setError('Não foi possível gerar o QR Code. Tente com outro nome.')
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Erro ao conectar com a Evolution API. Verifique a API Key e se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="connect-container">
      <div className="connect-header">
        <h2>Conectar WhatsApp</h2>
        <p>Gere um QR Code para parear o seu celular e gerenciar suas mensagens pelo painel.</p>
      </div>

      <form className="connect-form" onSubmit={handleConnect}>
        <div className="form-group">
          <label htmlFor="instanceName">Nome do Dispositivo</label>
          <input
            id="instanceName"
            type="text"
            className="connect-input"
            value={instanceName}
            onChange={(e) => setInstanceName(e.target.value)}
            placeholder="Ex: meu-whatsapp"
            disabled={loading || connected}
          />
        </div>

        {!connected && (
          <button type="submit" className="connect-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div> Processando...
              </>
            ) : (
              'Gerar QR Code'
            )}
          </button>
        )}
      </form>

      {error && <div className="error-message">{error}</div>}

      {connected && (
        <div className="success-message">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Dispositivo conectado com sucesso!
        </div>
      )}

      {qrCodeData && !connected && (
        <div className="qr-container">
          <div className="qr-instructions">
            1. Abra o WhatsApp no seu celular<br />
            2. Toque em Mais opções (Três pontinhos) ou Configurações<br />
            3. Toque em Aparelhos conectados e "Conectar um aparelho"<br />
            4. Aponte a câmera para o QR Code abaixo
          </div>
          <div className="qr-image-wrapper">
            <img src={qrCodeData} alt="WhatsApp QR Code" className="qr-code" />
          </div>
        </div>
      )}
    </div>
  )
}
