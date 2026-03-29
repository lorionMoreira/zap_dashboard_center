import { useState, useEffect, useRef } from 'react'
import './Connect.css'
import { evolutionService } from '../../services/evolutionService'
import { useAuth } from '../../context/AuthContext'

export default function Connect() {
  const { user } = useAuth()
  const instanceName = user?.username || ''
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const pollingIntervalRef = useRef<number | null>(null)
  const initializedRef = useRef<boolean>(false)

  // Polling function to check connection status
  const startPolling = (name: string) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)

    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        const stateData = await evolutionService.getConnectionState(name)
        if (stateData?.instance?.state === 'open') {
          setConnected(true)
          setQrCodeData(null)
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
        }
      } catch (err) {
        console.error('Error polling connection state:', err)
      }
    }, 5000)
  }

  useEffect(() => {
    if (!instanceName) return

    // Previne chamadas duplicadas no React Strict Mode
    if (initializedRef.current) return
    initializedRef.current = true

    const initialize = async () => {
      setLoading(true)
      setError(null)

      try {
        // 1. Verifica se a instância já existe na lista
        const instances = await evolutionService.fetchInstances()
        // Evolution API pode retornar em formatos diferentes dependendo da versão, tenta cobrir ambos
        const exists = instances.some((inst: any) =>
          inst.instance?.instanceName === instanceName || inst.name === instanceName
        )

        if (exists) {
          // 2. Se já existe, checa o estado 
          const stateData = await evolutionService.getConnectionState(instanceName)

          console.log('stateData')
          console.log(stateData)
          // se open - conectado
          // se close - desconectado

          if (stateData?.instance?.state === 'open') {
            setConnected(true)
            setLoading(false)
            return
          }

          // Instância não está conectada — tenta pegar o QR code
          const connectResponse = await evolutionService.connectInstance(instanceName)
          if (connectResponse?.base64) {
            setQrCodeData(connectResponse.base64)
            startPolling(instanceName)
          } else if (connectResponse?.instance?.state === 'open') {
            setConnected(true)
          }
        } else {
          // 3. Se não existe — cria e pega o QR code
          const response = await evolutionService.createInstance(instanceName)

          if (response?.qrcode && response.qrcode.base64) {
            setQrCodeData(response.qrcode.base64)
            startPolling(instanceName)
          } else if (response?.instance?.status === 'open') {
            setConnected(true)
          } else {
            // Criado mas sem QR — tenta no endpoint de connect
            const connectResponse = await evolutionService.connectInstance(instanceName)
            if (connectResponse?.base64) {
              setQrCodeData(connectResponse.base64)
              startPolling(instanceName)
            } else if (connectResponse?.instance?.state === 'open') {
              setConnected(true)
            } else {
              setError('Não foi possível gerar o QR Code. Tente novamente mais tarde.')
            }
          }
        }
      } catch (err: any) {
        console.error('Erro na inicialização:', err)
        setError(
          err.response?.data?.message ||
          err?.message ||
          'Erro ao conectar com a Evolution API. Verifique se a API está rodando.'
        )
        // Reset o ref caso de erro para permitir tentar novamente interagindo ou recarregando
        initializedRef.current = false
      } finally {
        setLoading(false)
      }
    }

    initialize()

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [instanceName])

  const handleDisconnect = async () => {
    if (!window.confirm('Tem certeza que deseja desconectar o WhatsApp?')) return

    setLoading(true)
    try {
      await evolutionService.logoutInstance(instanceName)
      setConnected(false)
      setQrCodeData(null)
      // Recarrega a página para resetar todos os estados e refs de forma limpa
      window.location.reload()
    } catch (err: any) {
      console.error('Erro ao desconectar:', err)
      setError('Erro ao desconectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="connect-container">
      <div className="connect-header">
        <h2>Conectar WhatsApp</h2>
        <p>
          {loading
            ? 'Verificando conexão...'
            : connected
              ? 'Seu dispositivo está conectado!'
              : 'Escaneie o QR Code abaixo para conectar seu WhatsApp.'}
        </p>
      </div>

      {loading && (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <span>Preparando conexão...</span>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {connected && (
        <>
          <div className="success-message">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Dispositivo conectado com sucesso!
          </div>
          
          <button 
            className="disconnect-btn" 
            onClick={handleDisconnect}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : (
              <>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '18px', height: '18px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Desconectar WhatsApp
              </>
            )}
          </button>
        </>
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
