'use client'

import { useState, useEffect } from 'react'
import { DiagnosisResult } from '@/lib/diagnosis'
import { evaluateFinance, FinanceInsight } from '@/lib/finance'
import { financeLevel } from '@/lib/financeLevel'
import { getATCComparison, getCBComparison, getCRComparison } from '@/lib/metricsHelpers'
import { formatCurrency } from '@/lib/formatters'
import useTranslations from '@/hooks/useTranslations'
import { CTA_WHATSAPP_URL } from '@/lib/constants'
import Tooltip from './Tooltip'
// MVP: Guardado e historial comentados. Más adelante remover comentarios para restaurar.
// import SaveModal from './SaveModal'
// import HistoryModal from './HistoryModal'
import ShareModal from './ShareModal'
// import { useAuth } from '@/lib/auth'

interface ResultCardProps {
  result: DiagnosisResult
  onNewDiagnosis: () => void
  onEditData: () => void
  diagnosisData: {
    visits: number
    carts: number
    orders: number
    sales?: number | null
    adspend?: number | null
    ordersCount?: number | null
  }
  onResultChange?: (result: DiagnosisResult) => void
  onDiagnosisDataChange?: (data: any) => void
}

export default function ResultCard({ result, onNewDiagnosis, onEditData, diagnosisData, onResultChange, onDiagnosisDataChange }: ResultCardProps) {
  const { t } = useTranslations()
  // const { user, signIn } = useAuth()
  // const [showSaveDialog, setShowSaveDialog] = useState(false)
  // const [showSaveModal, setShowSaveModal] = useState(false)
  // const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  // const [previousUser, setPreviousUser] = useState(user)

  // MVP: Redirigir al Home si el usuario cierra sesión – comentado.
  // useEffect(() => {
  //   if (previousUser && !user) {
  //     onNewDiagnosis()
  //   }
  //   setPreviousUser(user)
  // }, [user, previousUser])

  // MVP: Iniciar sesión y guardar – comentado.
  // const handleSaveClick = async () => {
  //   if (!user) {
  //     try {
  //       await signIn()
  //       setShowSaveModal(true)
  //     } catch (error) {
  //       console.error('Error al iniciar sesión:', error)
  //     }
  //   } else {
  //     setShowSaveModal(true)
  //   }
  // }

  // MVP: Guardado desde modal – comentado.
  // const handleSave = async (saveData: { yyyymm: string, monthLabel: string, note: string }) => {
  //   try {
  //     setShowSaveModal(false)
  //   } catch (error) {
  //     console.error('Error al guardar:', error)
  //   }
  // }


  // Determinar el mensaje según el diagnóstico
  const getMessage = (dx: string) => {
    const messages = {
      trafico: 'necesita más visitantes',
      pagina_oferta: 'convierte bien pero pocos llegan al carrito',
      checkout_confianza: 'tiene muchos carritos pero pocos se completan',
      escalar: 'está lista para crecer'
    }
    return messages[dx as keyof typeof messages] || 'necesita optimización'
  }

  // Obtener el CTA del microcurso según el diagnóstico
  const getMicrocourseCta = (dx: string) => {
    const ctas = {
      trafico: t('cta.mcTraffic'),
      pagina_oferta: t('cta.mcPdp'),
      checkout_confianza: t('cta.mcCheckout'),
      escalar: t('cta.mcScale')
    }
    return ctas[dx as keyof typeof ctas] || t('cta.mcTraffic')
  }

  // Obtener la interpretación de comunicación según el diagnóstico
  const getCommunicationInsight = (dx: string) => {
    const insights = {
      trafico: t('result.commTraffic'),
      pagina_oferta: t('result.commATC'),
      checkout_confianza: t('result.commCB'),
      escalar: t('result.commScale')
    }
    return insights[dx as keyof typeof insights] || t('result.commTraffic')
  }

  // Próximos pasos desde i18n (result.actionsByDiagnosis.{dx}, una acción por línea)
  const getBasicActions = (dx: string): string[] => {
    const raw = t(`result.actionsByDiagnosis.${dx}`)
    if (typeof raw === 'string' && raw && !raw.startsWith('result.actionsByDiagnosis.')) {
      return raw.split('\n').filter(Boolean)
    }
    return ['Revisá tu embudo de ventas.', 'Optimizá página y checkout.', 'Medí y repetí lo que funciona.']
  }

  // Evaluar finanzas si hay datos
  let hasFinanceData = false
  let financialLevel: 'critical' | 'fragile' | 'strong' | null = null
  let cacRatio = 0

  if (result.aov && result.roas && result.cac) {
    hasFinanceData = true
    financialLevel = financeLevel(result.roas)
    cacRatio = Math.round((result.cac / result.aov) * 100)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Tarjeta 1: Datos Básicos */}
      <div className="card-elevated">
        {/* Título y subtítulo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {result.dx === 'escalar' ? (
              <>
                ¡Excelente!{' '}
                <span className="text-green-600">
                  Todo está funcionando bien
                </span>
              </>
            ) : (
              <>
                Tu cuello principal:{' '}
                <span className="text-blue-600">
                  {t(`bottlenecks.${result.dx}`)}
                </span>
              </>
            )}
          </h1>
          <p className="text-xl text-gray-600">
            {t('result.sub', { msg: getMessage(result.dx) })}
          </p>
        </div>

        {/* KPIs con tooltips y comparación vs promedio */}
        <div className="grid grid-cols-3 gap-1 mb-8">
          {/* ATC */}
          {(() => {
            const atcComparison = getATCComparison(result.atc * 100)
            return (
              <div className={`text-center p-4 ${atcComparison.bgColorClass} rounded-lg min-w-0 flex flex-col h-full`}>
                <Tooltip content={t('tooltips.ATC')}>
                  <div className="text-xs sm:text-sm text-gray-600 cursor-help mb-2 leading-tight">{t('metrics.atcTitle')} ⓘ</div>
                </Tooltip>
                <div className={`text-2xl font-bold ${atcComparison.colorClass} mb-2`}>
                  {(result.atc * 100).toFixed(1)}%
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
            const cbComparison = getCBComparison(result.cb * 100)
            return (
              <div className={`text-center p-4 ${cbComparison.bgColorClass} rounded-lg min-w-0 flex flex-col h-full`}>
                <Tooltip content={t('tooltips.CB')}>
                  <div className="text-xs sm:text-sm text-gray-600 cursor-help mb-2 leading-tight">{t('metrics.cbTitle')} ⓘ</div>
                </Tooltip>
                <div className={`text-2xl font-bold ${cbComparison.colorClass} mb-2`}>
                  {(result.cb * 100).toFixed(1)}%
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
            const crComparison = getCRComparison(result.cr * 100)
            return (
              <div className={`text-center p-4 ${crComparison.bgColorClass} rounded-lg min-w-0 flex flex-col h-full`}>
                <Tooltip content={t('tooltips.CR')}>
                  <div className="text-xs sm:text-sm text-gray-600 cursor-help mb-2 leading-tight">{t('metrics.crTitle')} ⓘ</div>
                </Tooltip>
                <div className={`text-2xl font-bold ${crComparison.colorClass} mb-2`}>
                  {(result.cr * 100).toFixed(1)}%
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
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg inline-block">
            {t('notes.refs')}
          </p>
        </div>

        {/* Interpretación de comunicación */}
        <div className="mb-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('result.commTitle')}
          </h3>
          <p className="text-gray-700 mb-4">
            {t('result.commLead')}
          </p>
          <p className={`text-sm ${result.dx === 'escalar' ? 'text-green-700 font-semibold bg-white px-3 py-2 rounded-lg border border-green-300' : 'text-gray-600'}`}>
            {getCommunicationInsight(result.dx)}
          </p>
        </div>

        {/* Dónde se rompe el proceso (solo cuando hay datos de checkouts) */}
        {result.checkoutInsight && (result.checkoutInsight === 'logistica' || result.checkoutInsight === 'pago' || result.checkoutInsight === 'ambos') && (
          <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('result.checkoutInsightTitle')}
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {(result.checkoutInsight === 'logistica' || result.checkoutInsight === 'ambos') && (
                <p>{t('result.checkoutInsightLogistica')}</p>
              )}
              {(result.checkoutInsight === 'pago' || result.checkoutInsight === 'ambos') && (
                <p>{t('result.checkoutInsightPago')}</p>
              )}
            </div>
          </div>
        )}

        {/* Plan de 3 acciones básicas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('finance.actionsTitleBasic')}
          </h3>
          <div className="space-y-3">
            {getBasicActions(result.dx).map((action, index) => (
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
      {hasFinanceData ? (
        <div className="card-elevated">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('finance.title')}
          </h2>
          
          {/* Stats financieras */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">
                <Tooltip content="AOV (Ticket Promedio): ventas/pedidos">
                  <span className="cursor-help">{t('finance.aov')} ⓘ</span>
                </Tooltip>
              </span>
              <span className="text-xl font-bold text-gray-900">${formatCurrency(result.aov || 0)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">
                <Tooltip content="ROAS (Retorno de Ads): ventas/gasto en ads">
                  <span className="cursor-help">{t('finance.roas')} ⓘ</span>
                </Tooltip>
              </span>
              <span className="text-xl font-bold text-gray-900">{result.roas?.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">
                <Tooltip content="CAC (Costo por Cliente): gasto en ads/pedidos">
                  <span className="cursor-help">{t('finance.cac')} ⓘ</span>
                </Tooltip>
              </span>
              <span className="text-xl font-bold text-gray-900">${formatCurrency(result.cac || 0)}</span>
            </div>
          </div>

          {/* Resumen */}
          <div className={`p-6 rounded-xl border-2 mb-6 ${
            financialLevel === 'critical' ? 'bg-red-50 border-red-200' :
            financialLevel === 'fragile' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                financialLevel === 'critical' ? 'bg-red-100 text-red-800' :
                financialLevel === 'fragile' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {t(`finance.level.${financialLevel}`)}
              </span>
            </div>
            <div className="mb-4">
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
            {(diagnosisData.ordersCount && diagnosisData.ordersCount < 10) && (
              <p className="text-xs text-gray-500 mt-2">
                {t('finance.notes.smallSample')}
              </p>
            )}
          </div>

          {/* Acciones financieras - Simplificadas */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('finance.actionsTitleFinance')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <p className="text-gray-700">Mejorá tu página de producto: clarificá valor y agregá prueba social</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <p className="text-gray-700">Optimizá el checkout: menos campos, costos claros, contacto visible</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <p className="text-gray-700">Subí el ticket promedio: packs, envío gratis, upsells</p>
              </div>
            </div>
          </div>

          {/* MVP: Botón guardar / Iniciar sesión y guardar – comentado */}
          {/* <div className="text-center">
            <button 
              onClick={handleSaveClick}
              className="btn-outline"
            >
              {user ? t('buttons.saveDiagnosis') : t('buttons.loginSave')}
            </button>
          </div> */}
        </div>
      ) : (
        <div className="card-elevated">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('result.financeEmptyTitle')}
            </h2>
            <p className="text-gray-600 mb-6 whitespace-pre-line">
              {t('result.financeEmptyText')}
            </p>
            <button
              onClick={onEditData}
              className="btn-outline"
            >
              {t('buttons.editData')}
            </button>
          </div>
        </div>
      )}

      {/* Tarjeta 3: CTAs y Acciones */}
      <div className="card-elevated">
        {/* CTA principal: Ver solución para [Diagnóstico] → WhatsApp o agendar */}
        <div className="text-center mb-8">
          <a
            href={CTA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-gradient text-lg px-8 py-4 inline-flex items-center justify-center"
          >
            {t(`cta.primary.${result.dx}`)}
          </a>
          {/* Texto "WhatsApp o agendar consultoría" — comentado por ahora
          <p className="text-sm text-gray-600 mt-2">
            {t('cta.primarySub')}
          </p>
          */}
        </div>

        {/* Acciones secundarias */}
        <div className="flex flex-col gap-3 justify-center max-w-sm mx-auto">
          {/* MVP: Ver historial – comentado */}
          {/* {user && (
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="btn-outline"
            >
              📊 Ver historial
            </button>
          )} */}
          <button 
            onClick={onNewDiagnosis}
            className="btn-outline"
          >
            🔄 Hacer nuevo diagnóstico
          </button>
        </div>

        {/* Link discreto para compartir */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setShowShareModal(true)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Compartir esta herramienta con un amigo
          </button>
        </div>
      </div>

      {/* MVP: Modal de guardar (mes y nota) – comentado */}
      {/* <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        diagnosisData={{
          dx: result.dx,
          visits: diagnosisData.visits,
          carts: diagnosisData.carts,
          orders: diagnosisData.orders,
          atc: result.atc,
          cb: result.cb,
          cr: result.cr,
          sales: diagnosisData.sales || null,
          adspend: diagnosisData.adspend || null,
          ordersCount: diagnosisData.ordersCount || null,
          aov: result.aov || null,
          roas: result.roas || null,
          cac: result.cac || null
        }}
      /> */}

      {/* MVP: Modal de historial – comentado */}
      {/* <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      /> */}

      {/* Modal de compartir */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        diagnosisData={{
          dx: result.dx,
          visits: diagnosisData.visits,
          carts: diagnosisData.carts,
          orders: diagnosisData.orders,
          atc: result.atc,
          cb: result.cb,
          cr: result.cr
        }}
      />
    </div>
  )
}