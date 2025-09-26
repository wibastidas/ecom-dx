'use client'

import { useState } from 'react'
import { trackDiagnosisStart, trackDiagnosisSubmit } from '@/lib/analytics'
import useTranslations from '@/hooks/useTranslations'
import Tooltip from './Tooltip'

interface MetricsFormData {
  visits: string
  carts: string
  purchases: string
  sales_total?: number
  ad_spend?: number
  orders?: number
}

interface MetricsFormProps {
  onDiagnosis: (visits: number, carts: number, purchases: number) => void
}

export default function MetricsForm({ onDiagnosis }: MetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    visits: '',
    carts: '',
    purchases: ''
  })
  const { t } = useTranslations()

  // Función simple para manejar cambios en los inputs
  const handleInputChange = (field: 'visits' | 'carts' | 'purchases', value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '')
    
    // Si el valor empieza con 0 y tiene más de un dígito, limpiar el 0
    let cleanedValue = numericValue
    if (numericValue.length > 1 && numericValue.startsWith('0')) {
      cleanedValue = numericValue.replace(/^0+/, '') || '0'
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: cleanedValue
    }))
  }

  // Validación simple sin librerías externas

  // Convertir a números de forma simple
  const visits = Number(formData.visits) || 0
  const carts = Number(formData.carts) || 0
  const purchases = Number(formData.purchases) || 0
  
  // Validación simple: todos los campos deben ser números positivos
  const isFormValid = visits > 0 && carts > 0 && purchases > 0 && carts <= visits && purchases <= carts

  // Debug simple
  console.log('🔍 Form validation:', {
    formData,
    visits,
    carts,
    purchases,
    isValid: isFormValid
  })
  

  // Calculate metrics in real-time
  const cv = visits ? (carts / visits) * 100 : 0
  const cc = carts ? (purchases / carts) * 100 : 0
  const tc = visits ? (purchases / visits) * 100 : 0

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 Datos del formulario:', formData)
    setIsSubmitting(true)
    
    try {
      // Track form submission
      trackDiagnosisStart()
      trackDiagnosisSubmit(visits, carts, purchases)
      
      // Trigger diagnosis
      onDiagnosis(visits, carts, purchases)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card-elevated max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Métricas básicas */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="section-title mb-0">{t('sections.basicMetrics')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label htmlFor="visits" className="form-label">
                <Tooltip content={t('descriptions.visits')}>
                  <span className="cursor-help whitespace-nowrap">👥 {t('labels.visits')} ⓘ</span>
                </Tooltip>
              </label>
              <input
                type="number"
                id="visits"
                value={formData.visits}
                onChange={(e) => handleInputChange('visits', e.target.value)}
                className="input-field"
                placeholder="1200"
                min="1"
                step="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="carts" className="form-label">
                <Tooltip content={t('descriptions.carts')}>
                  <span className="cursor-help whitespace-nowrap">🛒 {t('labels.carts')} ⓘ</span>
                </Tooltip>
              </label>
              <input
                type="number"
                id="carts"
                value={formData.carts}
                onChange={(e) => handleInputChange('carts', e.target.value)}
                className="input-field"
                placeholder="90"
                min="1"
                step="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchases" className="form-label">
                <Tooltip content={t('descriptions.orders')}>
                  <span className="cursor-help whitespace-nowrap">✅ {t('labels.orders')} ⓘ</span>
                </Tooltip>
              </label>
              <input
                type="number"
                id="purchases"
                value={formData.purchases}
                onChange={(e) => handleInputChange('purchases', e.target.value)}
                className="input-field"
                placeholder="24"
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Real-time metrics preview */}
        {visits > 0 && (
          <div className="metric-card">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Métricas calculadas:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center">
                <Tooltip content={t('tooltips.ATC')}>
                  <span className="text-gray-500 cursor-help">ATC ⓘ:</span>
                </Tooltip>
                <span className="ml-1 font-bold text-blue-600">{cv.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Tooltip content={t('tooltips.CB')}>
                  <span className="text-gray-500 cursor-help">CB ⓘ:</span>
                </Tooltip>
                <span className="ml-1 font-bold text-green-600">{cc.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Tooltip content={t('tooltips.CR')}>
                  <span className="text-gray-500 cursor-help">CR ⓘ:</span>
                </Tooltip>
                <span className="ml-1 font-bold text-purple-600">{tc.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Principal */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-white mb-2">🎯 ¿Listo para tu diagnóstico?</h3>
            <p className="text-blue-100 text-sm">Obtén recomendaciones personalizadas en segundos</p>
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg transform flex items-center justify-center space-x-3 ${
              isFormValid 
                ? 'bg-white hover:bg-gray-50 text-blue-600 hover:shadow-xl hover:-translate-y-0.5' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } ${isSubmitting ? 'opacity-75' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">Analizando...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-lg">{t('buttons.getDiag')}</span>
              </>
            )}
          </button>
          
          <p className="text-center text-blue-100 text-xs mt-3">
            {t('notes.fast')}
          </p>
          
          {/* Mensaje de ayuda para validación */}
          {!isFormValid && (
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm text-center">
                {visits <= 0 && '👥 Ingresá las visitas únicas • '}
                {carts <= 0 && '🛒 Ingresá los carritos iniciados • '}
                {purchases <= 0 && '✅ Ingresá las compras completadas • '}
                {visits > 0 && carts > 0 && purchases > 0 && carts > visits && '⚠️ Los carritos no pueden ser más que las visitas • '}
                {visits > 0 && carts > 0 && purchases > 0 && purchases > carts && '⚠️ Las compras no pueden ser más que los carritos'}
              </p>
            </div>
          )}
        </div>

        {/* Acordeón opcional - Cerrado por defecto */}
        <div className="space-y-4">
          <div className="divider"></div>
          
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-open:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('sections.improvePrecision')}</h3>
                    <p className="text-sm text-gray-600">{t('sections.improvePrecisionDesc')}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 transform group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </summary>
            
            <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 gap-6">
                <div className="form-group">
                  <label htmlFor="sales_total" className="form-label">
                    <Tooltip content={t('descriptions.sales')}>
                      <span className="cursor-help whitespace-nowrap">💰 {t('labels.sales')} ⓘ</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    id="sales_total"
                    className="input-field"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ad_spend" className="form-label">
                    <Tooltip content={t('descriptions.adspend')}>
                      <span className="cursor-help whitespace-nowrap">📢 {t('labels.adspend')} ⓘ</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    id="ad_spend"
                    className="input-field"
                    placeholder="1000"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="orders" className="form-label">
                    <Tooltip content={t('descriptions.ordersCount')}>
                      <span className="cursor-help whitespace-nowrap">📦 {t('labels.ordersCount')} ⓘ</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    id="orders"
                    className="input-field"
                    placeholder="25"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 text-center">
                  {t('notes.financeNote')}
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{t('buttons.calcFinance')}</span>
                </button>
              </div>
            </div>
          </details>
        </div>
      </form>
    </div>
  )
}