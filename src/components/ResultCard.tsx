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

interface ResultCardProps {
  result: DiagnosisResult
  onNewDiagnosis: () => void
}

export default function ResultCard({ result, onNewDiagnosis }: ResultCardProps) {
  console.log('🎯 ResultCard renderizando con:', result)
  const [showDetails, setShowDetails] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [financialData, setFinancialData] = useState<FinancialMetrics | null>(null)
  const { user } = useAuth()
  
  const reco = recoData[result.dx as keyof typeof recoData]
  console.log('📋 Datos de recomendación:', reco)
  
  const handleSalesPageClick = () => {
    trackSalesPageCtaClick()
  }

  const getStatusColor = (dx: string) => {
    switch (dx) {
      case 'saludable':
        return 'text-green-600 bg-green-100'
      case 'ok_sample_low':
        return 'text-yellow-600 bg-yellow-100'
      case 'trafico':
      case 'oferta_web':
      case 'checkout':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (dx: string) => {
    switch (dx) {
      case 'saludable':
        return '✅'
      case 'ok_sample_low':
        return '⚠️'
      case 'trafico':
      case 'oferta_web':
      case 'checkout':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="space-y-6">
      {/* Result Summary */}
      <div className="card">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(result.dx)}`}>
            <span className="mr-2">{getStatusIcon(result.dx)}</span>
            {getDiagnosisLabel(result.dx)}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {reco.title}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {reco.description}
          </p>
        </div>

        {/* Metrics Display */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {result.cv.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Conversión a Carrito</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {result.cc.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Conversión de Carrito</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {result.tc.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Conversión Total</div>
          </div>
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
            {showDetails ? 'Ocultar' : 'Ver'} recomendaciones detalladas
          </button>
          
          <button
            onClick={onNewDiagnosis}
            className="w-full text-gray-600 hover:text-gray-800 text-sm"
          >
            Hacer nuevo diagnóstico
          </button>
        </div>
      </div>

      {/* Detailed Recommendations */}
      {showDetails && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Plan de Acción (7 días)
          </h3>
          
          <div className="space-y-4">
            {reco.actions.map((action, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-medium text-gray-900 mb-1">
                  {index + 1}. {action.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Prioridad:</span>
              <span className="font-medium text-blue-900">{reco.priority}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Tiempo estimado:</span>
              <span className="font-medium text-blue-900">{reco.timeline}</span>
            </div>
          </div>
        </div>
      )}

      {/* Save Diagnosis Option */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            ¿Quieres guardar este diagnóstico?
          </h3>
          <p className="text-primary-700 text-sm mb-4">
            {user 
              ? 'Guarda este diagnóstico en tu historial para hacer seguimiento de tu progreso'
              : 'Inicia sesión con Google para guardar tu histórico y hacer seguimiento de tu progreso'
            }
          </p>
          <button 
            onClick={() => setShowSaveDialog(true)}
            className="btn-primary"
          >
            {user ? 'Guardar diagnóstico mensual' : 'Iniciar sesión y guardar'}
          </button>
          
          <a
            href="https://calendly.com/williambastidas/mentoria-ecommerce"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSalesPageClick}
            className="btn-secondary block text-center mt-2"
          >
            Ver programa 1:1 (USD 247)
          </a>
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
        onSave={() => {
          // TODO: Implement save functionality with financial data
          console.log('Saving diagnosis:', result, 'Financial data:', financialData)
        }}
        result={result}
      />
    </div>
  )
}
