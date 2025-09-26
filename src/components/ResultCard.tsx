'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DiagnosisResult } from '@/lib/diagnosis'
import { getDiagnosisLabel, getDiagnosisDescription } from '@/lib/diagnosis'
import { trackSalesPageCtaClick } from '@/lib/analytics'
import { useAuth } from './AuthProvider'
import SaveDialog from './SaveDialog'
import FinancialAccordion from './FinancialAccordion'
import { FinancialMetrics } from '@/lib/financial'
import recoData from '@/data/reco.json'
import useTranslations from '@/hooks/useTranslations'
import Tooltip from './Tooltip'

interface ResultCardProps {
  result: DiagnosisResult
  onNewDiagnosis: () => void
}

export default function ResultCard({ result, onNewDiagnosis }: ResultCardProps) {
  console.log('🎯 ResultCard renderizando con:', result)
  const { t } = useTranslations()
  const [showDetails, setShowDetails] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [financialData, setFinancialData] = useState<FinancialMetrics | null>(null)
  const { user } = useAuth()

  // Determinar el bottleneck principal
  const getBottleneck = () => {
    const { cv, cc, tc } = result
    
    // Si la conversión total es muy baja, el problema es tráfico
    if (tc < 1) return 'traffic'
    
    // Si la conversión a carrito es baja, el problema es conversión
    if (cv < 3) return 'conversion'
    
    // Si la conversión de carrito es baja, el problema es abandono
    if (cc < 30) return 'cart_abandonment'
    
    // Por defecto, si todo está bien, el problema es tráfico
    return 'traffic'
  }

  const bottleneck = getBottleneck()
  const atc = result.cv.toFixed(1)
  const cb = result.cc.toFixed(1)
  const cr = result.tc.toFixed(1)
  
  const reco = recoData[result.dx as keyof typeof recoData]
  console.log('📋 Datos de recomendación:', reco)
  
  const handleSalesPageClick = () => {
    trackSalesPageCtaClick()
  }

  const getStatusColor = (dx: string) => {
    switch (dx) {
      case 'saludable':
        return 'status-success'
      case 'ok_sample_low':
        return 'status-warning'
      case 'trafico':
      case 'oferta_web':
      case 'checkout':
        return 'status-critical'
      default:
        return 'status-info'
    }
  }

  const getStatusIcon = (dx: string) => {
    switch (dx) {
      case 'saludable':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'ok_sample_low':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getMetricColor = (value: number, type: 'cv' | 'cc' | 'tc') => {
    const thresholds = {
      cv: { good: 4, warning: 2 },
      cc: { good: 15, warning: 10 },
      tc: { good: 1, warning: 0.5 }
    }
    
    const threshold = thresholds[type]
    if (value >= threshold.good) return 'text-green-600'
    if (value >= threshold.warning) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Result Block */}
      <div className="card-elevated">
        {/* Título principal */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('results.title', { bottleneck: t(`bottlenecks.${bottleneck}`) })}
        </h2>
        
        {/* Subtítulo */}
        <p className="text-lg text-gray-600 mb-6">
          {t('results.subtitle', { message: t(`messages.${bottleneck}`) })}
        </p>

        {/* Tres KPIs siempre visibles */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
          <div className="text-center">
            <div className="text-sm text-gray-700 mb-2">
              <Tooltip content={t('tooltips.ATC')}>
                <span className="cursor-help">ATC (Agregar al Carrito): <strong className="text-blue-600">{atc}%</strong> ⓘ</span>
              </Tooltip>
              <span className="mx-2">·</span>
              <Tooltip content={t('tooltips.CB')}>
                <span className="cursor-help">Cart→Buy (Carrito a Compra): <strong className="text-green-600">{cb}%</strong> ⓘ</span>
              </Tooltip>
              <span className="mx-2">·</span>
              <Tooltip content={t('tooltips.CR')}>
                <span className="cursor-help">CR (Conversión Total): <strong className="text-purple-600">{cr}%</strong> ⓘ</span>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Banda de referencia */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {t('results.reference')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="https://calendly.com/williambastidas/mentoria-ecommerce"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSalesPageClick}
            className="w-full btn-primary text-center block"
          >
            Ver programa 1:1 (USD 247)
          </a>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full btn-secondary"
          >
            {showDetails ? 'Ocultar detalles' : 'Ver recomendaciones detalladas'}
          </button>

          <button
            onClick={onNewDiagnosis}
            className="w-full btn-outline"
          >
            Hacer nuevo diagnóstico
          </button>
        </div>
      </div>

      {/* Detailed Recommendations */}
      {showDetails && reco && (
        <div className="card">
          <h3 className="section-title mb-4">Recomendaciones específicas</h3>
          <div className="space-y-4">
            {reco.actions?.map((accion: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{accion.titulo}</h4>
                  <p className="text-sm text-gray-600">{accion.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Diagnosis Option */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Quieres guardar este diagnóstico?
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {user
              ? 'Guarda este diagnóstico en tu historial para hacer seguimiento de tu progreso'
              : 'Inicia sesión con Google para guardar tu histórico y hacer seguimiento de tu progreso'
            }
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="w-full btn-primary"
            >
              {user ? 'Guardar diagnóstico mensual' : 'Iniciar sesión y guardar'}
            </button>

            <a
              href="https://calendly.com/williambastidas/mentoria-ecommerce"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSalesPageClick}
              className="w-full btn-secondary block text-center"
            >
              Ver programa 1:1 (USD 247)
            </a>
          </div>
        </div>
      </div>

      {/* Financial Accordion */}
      <FinancialAccordion
        onFinancialData={(data) => {
          setFinancialData(data)
          console.log('💰 Datos financieros:', data)
        }}
      />

      {/* Save Dialog */}
          <SaveDialog
            isOpen={showSaveDialog}
            onClose={() => setShowSaveDialog(false)}
            onSave={(month: string, newsletterSubscribed?: boolean) => {
              // TODO: Implement save functionality with financial data, month, and newsletter subscription
              console.log('Saving diagnosis:', result, 'Financial data:', financialData, 'Month:', month, 'Newsletter subscribed:', newsletterSubscribed)
            }}
            result={result}
          />
    </div>
  )
}