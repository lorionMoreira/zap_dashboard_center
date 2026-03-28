import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/paths'
import './Onboarding.css'

const step1Schema = z.object({
  barbeariaNome: z.string().min(1, 'O nome da barbearia é obrigatório'),
  barbeariaNomeSocial: z.string().min(1, 'O nome social é obrigatório'),
  barbeariaContato: z.string().optional(),
})

const step2Schema = z.object({
  barbeiroNome: z.string().min(1, 'O nome do barbeiro é obrigatório'),
  barbeiroTelefone: z.string().optional(),
  barbeiroPlanoStatus: z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

export default function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<Partial<Step1Data>>({})
  const navigate = useNavigate()

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
  })

  const onStep1Submit = (data: Step1Data) => {
    setFormData(data)
    setStep(2)
  }

  const onStep2Submit = (data: Step2Data) => {
    const finalData = { ...formData, ...data }
    console.log('Dados do Onboarding:', finalData)
    // Here we would typically save this data to the backend API

    navigate(ROUTES.dashboard, { replace: true })
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>Conclua seu Cadastro</h1>
        
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Barbearia</div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Barbeiro</div>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmitStep1(onStep1Submit)} className="onboarding-form">
            <h2>Dados da Barbearia</h2>
            
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" {...registerStep1('barbeariaNome')} placeholder="Nome da Barbearia" />
              {errorsStep1.barbeariaNome && <span className="error">{errorsStep1.barbeariaNome.message}</span>}
            </div>

            <div className="form-group">
              <label>Nome Social *</label>
              <input type="text" {...registerStep1('barbeariaNomeSocial')} placeholder="Razão Social / Nome Social" />
              {errorsStep1.barbeariaNomeSocial && <span className="error">{errorsStep1.barbeariaNomeSocial.message}</span>}
            </div>

            <div className="form-group">
              <label>Contato</label>
              <input type="text" {...registerStep1('barbeariaContato')} placeholder="(00) 00000-0000" />
            </div>

            <button type="submit" className="btn-primary">Próximo</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitStep2(onStep2Submit)} className="onboarding-form">
            <h2>Dados do Barbeiro</h2>
            
            <div className="form-group">
              <label>Nome *</label>
              <input type="text" {...registerStep2('barbeiroNome')} placeholder="Seu Nome" />
              {errorsStep2.barbeiroNome && <span className="error">{errorsStep2.barbeiroNome.message}</span>}
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input type="text" {...registerStep2('barbeiroTelefone')} placeholder="(00) 00000-0000" />
            </div>

            <div className="form-group">
              <label>Status do Plano</label>
              <input type="text" {...registerStep2('barbeiroPlanoStatus')} placeholder="Ex: Ativo" />
            </div>

            <div className="button-group">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">Voltar</button>
              <button type="submit" className="btn-primary">Finalizar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
