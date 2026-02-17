'use client'

import { useState } from 'react'
import { trackDiagnosisStart, trackDiagnosisSubmit } from '@/lib/analytics'
import useTranslations from '@/hooks/useTranslations'
import Tooltip from './Tooltip'
import { PLATFORM_OPTIONS, getHelpMode, type Platform } from '@/lib/constants'

interface MetricsFormData {
  visits: string
  carts: string
  purchases: string
  sales_total?: string
  ad_spend?: string
}

interface MetricsFormProps {
  onDiagnosis: (visits: number, carts: number, purchases: number, sales?: number, adspend?: number, ordersCount?: number, storeUrl?: string, platform?: string, checkouts?: number) => void
  openAccordion?: boolean
}

export default function MetricsForm({ onDiagnosis, openAccordion = false }: MetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [storeUrl, setStoreUrl] = useState('')
  const [storeUrlTouched, setStoreUrlTouched] = useState(false)
  const [platform, setPlatform] = useState<Platform | ''>('')
  const [platformTouched, setPlatformTouched] = useState(false)
  const [formData, setFormData] = useState({
    visits: '',
    carts: '',
    checkouts: '',
    purchases: '',
    sales_total: '',
    ad_spend: ''
  })
  const [touchedFields, setTouchedFields] = useState({
    visits: false,
    carts: false,
    purchases: false
  })
  const { t } = useTranslations()

  // Acordeón "Mejorá la precisión" (ventas, ads): oculto para simplificar; cambiar a true para mostrarlo
  const showImprovePrecisionAccordion = false

  // Modo de ayuda para helper texts: Shopify (rutas exactas) vs General (cualquier otra plataforma)
  const helpMode = platform ? getHelpMode(platform) : 'general'

  // Función simple para manejar cambios en los inputs
  const handleInputChange = (field: string, value: string) => {
    if (field === 'storeUrl') {
      setStoreUrl(value)
      return
    }
    // Para campos numéricos, solo permitir números
    if (['visits', 'carts', 'checkouts', 'purchases'].includes(field)) {
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
    } else {
      // Para campos monetarios, permitir números y punto decimal
      const numericValue = value.replace(/[^0-9.]/g, '')
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }))
    }
  }

  // Función para marcar campo como tocado
  const handleInputBlur = (field: 'visits' | 'carts' | 'purchases') => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }))
  }

  // Función para obtener el estado de validación de un campo
  const getFieldValidation = (field: 'visits' | 'carts' | 'purchases') => {
    const value = Number(formData[field]) || 0
    const isTouched = touchedFields[field]
    
    if (!isTouched) return { status: 'neutral', message: '' }
    
    if (value <= 0) {
      return { status: 'error', message: t('validation.fieldRequired') }
    }
    
    if (field === 'carts' && value > visits) {
      return { status: 'error', message: t('validation.cartsGtVisits') }
    }
    
    if (field === 'purchases' && value > carts) {
      return { status: 'error', message: t('validation.ordersGtCarts') }
    }
    
    return { status: 'success', message: '' }
  }

  // Validación simple sin librerías externas

  // Convertir a números de forma simple
  const visits = Number(formData.visits) || 0
  const carts = Number(formData.carts) || 0
  const purchases = Number(formData.purchases) || 0
  const checkoutsNum = formData.checkouts.trim() ? Number(formData.checkouts) : 0

  // URL debe ser dominio válido: al menos un TLD (ej .com, .com.ar, .ar, .uy)
  const isValidStoreUrl = (url: string) => {
    const s = url.trim().replace(/^https?:\/\//i, '').split('/')[0] || ''
    return /^[a-z0-9.-]+\.[a-z]{2,6}$/i.test(s)
  }
  // URL opcional: vacío = válido; si hay texto, debe tener formato de dominio válido
  const storeUrlValid = storeUrl.trim() === '' || isValidStoreUrl(storeUrl.trim())

  // Con checkouts opcional: compras <= checkouts. Si checkouts > carritos → Compra Rápida (no se bloquea)
  const checkoutsValid = !checkoutsNum || purchases <= checkoutsNum

  // Bloque financiero: opcional. No pedimos "N.º de pedidos" por separado; usamos Compras completadas.
  // Si completan ventas y ads, usamos purchases como ordersCount. Nunca exigimos un campo "orders".
  const hasSalesOrAdspend = (formData.sales_total?.trim() ?? '') !== '' || (formData.ad_spend?.trim() ?? '') !== ''
  const financialBlockOk = !hasSalesOrAdspend || purchases > 0  // si hay datos fin., basta con tener Compras
  
  // Identidad (URL y plataforma) opcional; métricas requeridas
  const isFormValid =
    visits > 0 &&
    carts > 0 &&
    purchases > 0 &&
    carts <= visits &&
    purchases <= carts &&
    checkoutsValid &&
    financialBlockOk
  


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // ordersCount = Compras completadas (mismo número; no pedimos "N.º de pedidos" por separado)
      const diagnosisData = {
        visits,
        carts,
        purchases,
        sales_total: Number(formData.sales_total) || undefined,
        ad_spend: Number(formData.ad_spend) || undefined,
        orders: purchases
      }
      
      // Track form submission
      trackDiagnosisStart()
      trackDiagnosisSubmit(visits, carts, purchases)
      
      // Trigger diagnosis con todos los datos + identidad y checkouts (opcional) para log de uso
      const checkoutsVal = formData.checkouts.trim() ? Number(formData.checkouts) : undefined
      onDiagnosis(visits, carts, purchases, diagnosisData.sales_total, diagnosisData.ad_spend, purchases, storeUrl.trim(), platform || undefined, checkoutsVal)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-0">
        {/* Panel único: intro + URL/Plataforma + Métricas + CTA */}
        <div className="card-elevated rounded-2xl border border-gray-200 bg-white shadow-lg p-6 sm:p-8 space-y-8">
          <p className="text-gray-700 text-center sm:text-left">
            {t('app.formIntro')}
          </p>

          {/* URL + Plataforma — 2 cols desktop, 1 móvil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="storeUrl" className="form-label">
                🌐 {t('platforms.storeUrlLabel')}
              </label>
              <input
                type="text"
                id="storeUrl"
                value={storeUrl}
                onChange={(e) => handleInputChange('storeUrl', e.target.value)}
                onBlur={() => setStoreUrlTouched(true)}
                className={`input-field ${storeUrlTouched && !storeUrlValid ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder={t('platforms.storeUrlPlaceholder')}
                inputMode="url"
                autoComplete="off"
                aria-required="false"
              />
              <p className="mt-1 text-xs text-gray-500">{t('app.formUrlHelper')}</p>
              {storeUrlTouched && !storeUrlValid && storeUrl.trim() !== '' && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {t('validation.urlInvalid')}
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="platform" className="form-label">
                📦 {t('platforms.label')}
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform | '')}
                onBlur={() => setPlatformTouched(true)}
                className="input-field"
              >
                <option value="">{t('platforms.placeholder')}</option>
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Métricas: Visitas, Carritos, Checkouts (opcional), Compras */}
          <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="visits" className="form-label">
                <Tooltip content={t(`platforms.helpers.${helpMode}.visits`)}>
                  <span className="cursor-help whitespace-nowrap">👥 {t('labels.visits')} ⓘ</span>
                </Tooltip>
                <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
              </label>
              <input
                type="number"
                id="visits"
                value={formData.visits}
                onChange={(e) => handleInputChange('visits', e.target.value)}
                onBlur={() => handleInputBlur('visits')}
                className={`input-field ${
                  getFieldValidation('visits').status === 'error' 
                    ? 'border-red-300 focus:border-red-500' 
                    : getFieldValidation('visits').status === 'success'
                    ? 'border-green-300 focus:border-green-500'
                    : ''
                }`}
                placeholder="1200"
                min="1"
                step="1"
                inputMode="numeric"
                autoComplete="off"
                pattern="[0-9]*"
              />
              {getFieldValidation('visits').status === 'error' && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {getFieldValidation('visits').message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="carts" className="form-label">
                <Tooltip content={t(`platforms.helpers.${helpMode}.carts`)}>
                  <span className="cursor-help whitespace-nowrap">🛒 {t('labels.carts')} ⓘ</span>
                </Tooltip>
                <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
              </label>
              <input
                type="number"
                id="carts"
                value={formData.carts}
                onChange={(e) => handleInputChange('carts', e.target.value)}
                onBlur={() => handleInputBlur('carts')}
                className={`input-field ${
                  getFieldValidation('carts').status === 'error' 
                    ? 'border-red-300 focus:border-red-500' 
                    : getFieldValidation('carts').status === 'success'
                    ? 'border-green-300 focus:border-green-500'
                    : ''
                }`}
                placeholder="90"
                min="1"
                step="1"
                inputMode="numeric"
                autoComplete="off"
                pattern="[0-9]*"
              />
              {getFieldValidation('carts').status === 'error' && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {getFieldValidation('carts').message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="purchases" className="form-label">
                <Tooltip content={t(`platforms.helpers.${helpMode}.orders`)}>
                  <span className="cursor-help whitespace-nowrap">✅ {t('labels.orders')} ⓘ</span>
                </Tooltip>
                <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
              </label>
              <input
                type="number"
                id="purchases"
                value={formData.purchases}
                onChange={(e) => handleInputChange('purchases', e.target.value)}
                onBlur={() => handleInputBlur('purchases')}
                className={`input-field ${
                  getFieldValidation('purchases').status === 'error' 
                    ? 'border-red-300 focus:border-red-500' 
                    : getFieldValidation('purchases').status === 'success'
                    ? 'border-green-300 focus:border-green-500'
                    : ''
                }`}
                placeholder="24"
                min="1"
                step="1"
                inputMode="numeric"
                autoComplete="off"
                pattern="[0-9]*"
              />
              {getFieldValidation('purchases').status === 'error' && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {getFieldValidation('purchases').message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkouts" className="form-label">
                <Tooltip content={t(`platforms.helpers.${helpMode}.checkouts`)}>
                  <span className="cursor-help whitespace-nowrap">💳 {t('labels.checkouts')} ⓘ</span>
                </Tooltip>
              </label>
              <input
                type="number"
                id="checkouts"
                value={formData.checkouts}
                onChange={(e) => handleInputChange('checkouts', e.target.value)}
                className={`input-field border-dashed ${checkoutsNum > 0 && !checkoutsValid ? 'border-red-300 focus:border-red-500' : ''}`}
                placeholder="—"
                min="0"
                step="1"
                inputMode="numeric"
                autoComplete="off"
                pattern="[0-9]*"
              />
              {checkoutsNum > 0 && !checkoutsValid && (
                <p className="mt-1 text-sm text-red-600">
                  {t('validation.ordersGtCheckouts')}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">{t('platforms.checkoutsOptionalInfo')}</p>
            </div>
          </div>
        </div>


        {/* Acordeón opcional - Mejorar precisión (ventas, gasto en ads) */}
        {showImprovePrecisionAccordion && (
        <div className="space-y-4">
          <div className="divider"></div>
          
          <details className="group" open={openAccordion}>
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
                    value={formData.sales_total}
                    onChange={(e) => handleInputChange('sales_total', e.target.value)}
                    className="input-field"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    autoComplete="off"
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
                    value={formData.ad_spend}
                    onChange={(e) => handleInputChange('ad_spend', e.target.value)}
                    className="input-field"
                    placeholder="1000"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <p className="text-sm text-gray-600 col-span-full -mt-2">
                  {t('sections.financeUsesCompras')}
                </p>
              </div>

            </div>
          </details>
        </div>
        )}

          {/* CTA Principal */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center space-x-3 ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } ${isSubmitting ? 'opacity-75' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg">Analizando...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">{t('app.formCta')}</span>
                </>
              )}
            </button>
            <p className="text-center text-gray-500 text-xs mt-3">
              {t('app.formMicrocopy')}
            </p>
            {!isFormValid && (
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-amber-800 text-sm font-medium mb-2">{t('sections.ctaCompleteToContinue')}</p>
                <ul className="text-amber-700 text-sm space-y-1 list-none">
                  {!storeUrlValid && storeUrl.trim() !== '' && <li className="flex items-center gap-2">🌐 {t('validation.urlInvalid')}</li>}
                  {(visits <= 0 || carts <= 0 || purchases <= 0) && <li className="flex items-center gap-2">📊 {t('sections.ctaBasicMetricsMissing')}</li>}
                  {visits > 0 && carts > 0 && purchases > 0 && carts > visits && <li className="flex items-center gap-2">⚠️ {t('validation.cartsGtVisits')}</li>}
                  {visits > 0 && carts > 0 && purchases > 0 && purchases > carts && <li className="flex items-center gap-2">⚠️ {t('validation.ordersGtCarts')}</li>}
                  {checkoutsNum > 0 && !checkoutsValid && <li className="flex items-center gap-2">💳 {t('validation.ordersGtCheckouts')}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}