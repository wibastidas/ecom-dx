'use client'

import { useState, useEffect } from 'react'
import { diagnose, DiagnosisResult } from '@/lib/diagnosis'
import { financeLevel } from '@/lib/financeLevel'
import { getATCComparison, getCBComparison, getCRComparison } from '@/lib/metricsHelpers'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import useTranslations from '@/hooks/useTranslations'
import Tooltip from './Tooltip'
import { HistoryItem } from '@/lib/saveService'

interface HistoryDetailModalProps {
  isOpen: boolean
  onClose: () => void
  historyItem: HistoryItem | null
}

export default function HistoryDetailModal({ isOpen, onClose, historyItem }: HistoryDetailModalProps) {
  const { t } = useTranslations()
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)

  // Calcular diagnóstico cuando se abre el modal
  useEffect(() => {
    if (isOpen && historyItem) {
      try {
        const result = diagnose(
          historyItem.visits,
          historyItem.carts,
          historyItem.orders,
          historyItem.sales || undefined,
          historyItem.adspend || undefined,
          historyItem.ordersCount || undefined
        )
        setDiagnosis(result)
      } catch (error) {
        console.error('Error calculando diagnóstico:', error)
      }
    }
  }, [isOpen, historyItem])

  if (!isOpen || !historyItem || !diagnosis) return null

  // Función para obtener el mensaje del subtítulo según el diagnóstico
  const getMessage = (dx: string) => {
    const messages = {
      trafico: t('result.commTraffic'),
      pagina_oferta: t('result.commATC'),
      checkout_confianza: t('result.commCB'),
      escalar: t('result.commScale')
    }
    return messages[dx as keyof typeof messages] || t('result.commTraffic')
  }

  // Función para obtener CTA del microcurso según diagnóstico
  const getMicrocourseCta = (dx: string) => {
    const ctaMap = {
      trafico: t('cta.mcTraffic'),
      pagina_oferta: t('cta.mcPdp'),
      checkout_confianza: t('cta.mcCheckout'),
      escalar: t('cta.mcScale')
    }
    return ctaMap[dx as keyof typeof ctaMap] || t('cta.mcScale')
  }

  // Obtener acciones básicas según el diagnóstico
  const getBasicActions = (dx: string) => {
    const actions = {
      trafico: [
        'Pausá lo que no vende: dejá solo el mejor anuncio por ángulo durante 72h.',
        'Arreglá la PDP: reescribí el hero en 1 línea y sumá 3 beneficios + 3 reseñas.',
        'Mostrá costos totales y políticas antes del pago para bajar abandono.'
      ],
      pagina_oferta: [
        'Subí el ATC: clarificá valor en la PDP y agregá prueba social arriba.',
        'Bajá fricción de checkout: menos campos, costos sin sorpresa, contacto visible.',
        'Mejorá calidad de tráfico: 3 creatividades (dolor/beneficio/prueba) a PDP exacta.'
      ],
      checkout_confianza: [
        'Aumentá AOV: bundling, packs y envío gratis desde umbral.',
        'Mejorá conversión (CR): ajustá mensaje del anuncio para alinear con la PDP.',
        'Negociá costos logísticos o medios de pago para mejorar margen efectivo.'
      ],
      escalar: [
        'Duplicá creatividades manteniendo el claim ganador.',
        'Abrí audiencias lookalike sin tocar la promesa central.',
        'Sumá remarketing con prueba social y objeciones resueltas.'
      ]
    }
    return actions[dx as keyof typeof actions] || actions.trafico
  }

  // Evaluar finanzas si hay datos
  let hasFinanceData = false
  let financialLevel: 'critical' | 'fragile' | 'strong' | null = null
  let cacRatio = 0

  if (diagnosis.aov && diagnosis.roas && diagnosis.cac) {
    hasFinanceData = true
    financialLevel = financeLevel(diagnosis.roas)
    cacRatio = Math.round((diagnosis.cac / diagnosis.aov) * 100)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Diagnóstico - {historyItem.monthLabel}
              </h2>
              {historyItem.note && (
                <p className="text-sm text-gray-600 mt-1">
                  Nota: "{historyItem.note}"
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
          {/* Tarjeta 1: Datos Básicos */}
          <div className="bg-gray-50 rounded-xl p-6">
            {/* Título y subtítulo */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {diagnosis.dx === 'escalar' ? (
                  <>
                    ¡Excelente!{' '}
                    <span className="text-green-600">
                      Todo estaba funcionando bien
                    </span>
                  </>
                ) : (
                  <>
                    Tu cuello principal:{' '}
                    <span className="text-blue-600">
                      {t(`bottlenecks.${diagnosis.dx}`)}
                    </span>
                  </>
                )}
              </h3>
              <p className="text-lg text-gray-600">
                {t('result.sub', { msg: getMessage(diagnosis.dx) })}
              </p>
            </div>

            {/* KPIs con tooltips y comparación vs promedio */}
            <div className="flex gap-1 mb-6 h-[250px]">
              {/* ATC */}
              {(() => {
                const atcComparison = getATCComparison(diagnosis.atc * 100)
                return (
                  <div className={`text-center p-4 ${atcComparison.bgColorClass} rounded-lg min-w-0 flex flex-col h-full flex-1`}>
                    <Tooltip content={t('tooltips.ATC')}>
                      <div className="text-xs sm:text-sm text-gray-600 cursor-help mb-2 leading-tight">{t('metrics.atcTitle')} ⓘ</div>
                    </Tooltip>
                    <div className={`text-2xl font-bold ${atcComparison.colorClass} mb-2`}>
                      {(diagnosis.atc * 100).toFixed(1)}%
                    </div>
                    <div className={`text-xs font-medium ${atcComparison.colorClass} mb-1`}>
                      {atcComparison.normalRange}
                    </div>
                    <div className="mt-auto">
                      <div className={`text-xs sm:text-sm font-bold ${atcComparison.colorClass} bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-md border-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center text-center ${atcComparison.status === 'above' ? 'border-green-300' : atcComparison.status === 'below' ? 'border-red-300' : 'border-blue-300'}`}>
                        <span className="leading-tight">{atcComparison.statusMessage}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}
              
              {/* Cart→Buy */}
              {(() => {
                const cbComparison = getCBComparison(diagnosis.cb * 100)
                return (
                  <div className={`text-center p-4 ${cbComparison.bgColorClass} rounded-lg min-w-0 flex flex-col h-full flex-1`}>
                    <Tooltip content={t('tooltips.CB')}>
                      <div className="text-xs sm:text-sm text-gray-600 cursor-help mb-2 leading-tight">{t('metrics.cbTitle')} ⓘ</div>
                    </Tooltip>
                    <div className={`text-2xl font-bold ${cbComparison.colorClass} mb-2`}>
                      {(diagnosis.cb * 100).toFixed(1)}%
                    </div>
                    <div className={`text-xs font-medium ${cbComparison.colorClass} mb-1`}>
                      {cbComparison.normalRange}
                    </div>
                    <div className="mt-auto">
                      <div className={`text-xs sm:text-sm font-bold ${cbComparison.colorClass} bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-md border-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center text-center ${cbComparison.status === 'above' ? 'border-green-300' : cbComparison.status === 'below' ? 'border-red-300' : 'border-blue-300'}`}>
                        <span className="leading-tight">{cbComparison.statusMessage}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}
              
              {/* CR */}
              {(() => {
                const crComparison = getCRComparison(diagnosis.cr * 100)
                return (
                  <div className={`text-center p-4 ${crComparison.bgColorClass} rounded-lg min-w-0 flex flex-col h-full flex-1`}>
                    <Tooltip content={t('tooltips.CR')}>
                      <div className="text-xs sm:text-sm text-gray-600 cursor-help mb-2 leading-tight">{t('metrics.crTitle')} ⓘ</div>
                    </Tooltip>
                    <div className={`text-2xl font-bold ${crComparison.colorClass} mb-2`}>
                      {(diagnosis.cr * 100).toFixed(1)}%
                    </div>
                    <div className={`text-xs font-medium ${crComparison.colorClass} mb-1`}>
                      {crComparison.normalRange}
                    </div>
                    <div className="mt-auto">
                      <div className={`text-xs sm:text-sm font-bold ${crComparison.colorClass} bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-md border-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center text-center ${crComparison.status === 'above' ? 'border-green-300' : crComparison.status === 'below' ? 'border-red-300' : 'border-blue-300'}`}>
                        <span className="leading-tight">{crComparison.statusMessage}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Banda de referencias */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                {t('notes.refs')}
              </p>
            </div>

            {/* Interpretación de comunicación */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t('result.commTitle')}
              </h4>
              <p className="text-gray-700 mb-2">
                {t('result.commLead')}
              </p>
              <p className={`text-sm ${diagnosis.dx === 'escalar' ? 'text-green-700 font-semibold bg-white px-3 py-2 rounded-lg border border-green-300' : 'text-gray-600'}`}>
                {getMessage(diagnosis.dx)}
              </p>
            </div>

            {/* Plan de 3 acciones básicas */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t('finance.actionsTitleBasic')}
              </h4>
              <div className="space-y-3">
                {getBasicActions(diagnosis.dx).map((action, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Finanzas (condicional) */}
          {hasFinanceData && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                {t('finance.title')}
              </h4>

              {/* Stats financieras */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">
                    <Tooltip content="AOV (Ticket Promedio): ventas/pedidos">
                      <span className="cursor-help">{t('finance.aov')} ⓘ</span>
                    </Tooltip>
                  </span>
                  <span className="text-lg font-bold text-gray-900">${diagnosis.aov?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">
                    <Tooltip content="ROAS (Retorno de Ads): ventas/gasto en ads">
                      <span className="cursor-help">{t('finance.roas')} ⓘ</span>
                    </Tooltip>
                  </span>
                  <span className="text-lg font-bold text-gray-900">{diagnosis.roas?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">
                    <Tooltip content="CAC (Costo por Cliente): gasto en ads/pedidos">
                      <span className="cursor-help">{t('finance.cac')} ⓘ</span>
                    </Tooltip>
                  </span>
                  <span className="text-lg font-bold text-gray-900">${diagnosis.cac?.toFixed(2)}</span>
                </div>
              </div>

              {/* Resumen financiero */}
              <div className={`p-4 rounded-xl border-2 mb-4 ${
                financialLevel === 'critical' ? 'bg-red-50 border-red-200' :
                financialLevel === 'fragile' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    financialLevel === 'critical' ? 'bg-red-100 text-red-800' :
                    financialLevel === 'fragile' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {t(`finance.level.${financialLevel}`)}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-gray-700">
                    {t(`finance.copy.${financialLevel}`)}
                  </p>
                </div>

                {/* Contexto CAC/AOV */}
                <p className="text-sm text-gray-600 mb-2">
                  {t('finance.copy.ratio', { ratio: cacRatio })}
                </p>

                <p className="text-xs text-gray-500">
                  {t('finance.copy.caveat')}
                </p>

                {/* Muestra chica */}
                {historyItem.ordersCount && historyItem.ordersCount < 10 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {t('finance.notes.smallSample')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Datos originales ingresados por el usuario */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-6">
              Datos ingresados
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tabla 1: Datos básicos de e-commerce */}
              <div>
                <h5 className="text-lg font-semibold text-gray-800 mb-4">
                  📊 Datos básicos de e-commerce
                </h5>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="space-y-0">
                    <div className="p-4 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-500 mb-1">Visitas únicas</div>
                      <div className="text-lg font-semibold text-gray-900">{formatNumber(historyItem.visits)}</div>
                    </div>
                    <div className="p-4 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-500 mb-1">Carritos iniciados</div>
                      <div className="text-lg font-semibold text-gray-900">{formatNumber(historyItem.carts)}</div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Compras completadas</div>
                      <div className="text-lg font-semibold text-gray-900">{formatNumber(historyItem.orders)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla 2: Datos financieros (si están disponibles) */}
              {(historyItem.sales || historyItem.adspend || historyItem.ordersCount) && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">
                    💰 Datos financieros
                  </h5>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="space-y-0">
                      {historyItem.sales && (
                        <div className="p-4 border-b border-gray-200">
                          <div className="text-sm font-medium text-gray-500 mb-1">Ventas totales (USD)</div>
                          <div className="text-lg font-semibold text-gray-900">${formatCurrency(historyItem.sales)}</div>
                        </div>
                      )}
                      {historyItem.adspend && (
                        <div className="p-4 border-b border-gray-200">
                          <div className="text-sm font-medium text-gray-500 mb-1">Gasto en publicidad (USD)</div>
                          <div className="text-lg font-semibold text-gray-900">${formatCurrency(historyItem.adspend)}</div>
                        </div>
                      )}
                      {historyItem.ordersCount && (
                        <div className="p-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Número de pedidos</div>
                          <div className="text-lg font-semibold text-gray-900">{formatNumber(historyItem.ordersCount)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta 3: CTA */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {t('cta.sub')}
            </h4>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mb-4 inline-flex items-center justify-center"
            >
              {getMicrocourseCta(diagnosis.dx)}
            </a>
            <p className="text-sm text-gray-600">
              Acceso inmediato. 90 minutos. Sin tecnicismos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
