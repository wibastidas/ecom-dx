'use client'

import { useState } from 'react'
import { DiagnosisResult } from '@/lib/diagnosis'
import { evaluateFinance, FinanceInsight } from '@/lib/finance'
import { financeLevel } from '@/lib/financeLevel'
import useTranslations from '@/hooks/useTranslations'
import Tooltip from './Tooltip'
import SaveModal from './SaveModal'
import HistoryModal from './HistoryModal'
import { useAuth } from '@/lib/auth'

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
}

export default function ResultCard({ result, onNewDiagnosis, onEditData, diagnosisData }: ResultCardProps) {
  const { t } = useTranslations()
  const { user, signIn } = useAuth()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Manejar click de "Iniciar sesión y guardar"
  const handleSaveClick = async () => {
    if (!user) {
      // Si no está logueado, iniciar sesión primero
      try {
        await signIn()
        // Después del login exitoso, abrir modal
        setShowSaveModal(true)
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
      }
    } else {
      // Si ya está logueado, abrir modal directamente
      setShowSaveModal(true)
    }
  }

  // Manejar guardado desde el modal
  const handleSave = async (saveData: { yyyymm: string, monthLabel: string, note: string }) => {
    try {
      // TODO: Implementar guardado en Firebase
      console.log('Guardando:', { ...saveData, result })
      setShowSaveModal(false)
      // TODO: Mostrar toast de éxito
    } catch (error) {
      console.error('Error al guardar:', error)
      // TODO: Mostrar toast de error
    }
  }

  // Manejar edición desde historial
  const handleEditFromHistory = (historyItem: any) => {
    // TODO: Implementar prellenado del formulario con datos del historial
    console.log('Editando desde historial:', historyItem)
    onEditData()
  }

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
            Tu cuello principal:{' '}
            <span className="text-blue-600">
              {t(`bottlenecks.${result.dx}`)}
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            {t('result.sub', { msg: getMessage(result.dx) })}
          </p>
        </div>

        {/* KPIs con tooltips */}
        <div className="grid grid-cols-3 gap-1 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg min-w-0">
              <Tooltip content={t('tooltips.ATC')}>
              <div className="text-sm text-gray-600 cursor-help mb-2 whitespace-nowrap">ATC ⓘ</div>
              </Tooltip>
            <div className="text-2xl font-bold text-blue-600">{(result.atc * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg min-w-0">
              <Tooltip content={t('tooltips.CB')}>
              <div className="text-sm text-gray-600 cursor-help mb-2 whitespace-nowrap">Cart→Buy ⓘ</div>
              </Tooltip>
            <div className="text-2xl font-bold text-green-600">{(result.cb * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center p-4  bg-purple-50 rounded-lg min-w-0">
              <Tooltip content={t('tooltips.CR')}>
              <div className="text-sm text-gray-600 cursor-help mb-2 whitespace-nowrap">CR ⓘ</div>
              </Tooltip>
            <div className="text-2xl font-bold text-purple-600">{(result.cr * 100).toFixed(1)}%</div>
          </div>
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
          <p className="text-sm text-gray-600">
            {getCommunicationInsight(result.dx)}
          </p>
      </div>

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
              <span className="text-xl font-bold text-gray-900">${result.aov?.toFixed(2)}</span>
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
              <span className="text-xl font-bold text-gray-900">${result.cac?.toFixed(2)}</span>
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
            {diagnosisData.ordersCount && diagnosisData.ordersCount < 10 && (
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

          {/* Botón recalcular */}
          <div className="text-center">
            <button
              onClick={onEditData}
              className="btn-outline"
            >
              {t('finance.cta')}
            </button>
          </div>
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
        {/* CTA al microcurso */}
        <div className="text-center mb-8">
          <button className="btn-primary text-lg px-8 py-4">
            {getMicrocourseCta(result.dx)}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            {t('cta.sub')}
          </p>
        </div>

        {/* Acciones secundarias */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleSaveClick}
            className="btn-outline"
          >
            {t('buttons.loginSave')}
          </button>
          {user && (
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="btn-outline"
            >
              Ver historial
            </button>
          )}
          <button 
            onClick={onNewDiagnosis}
            className="btn-outline"
          >
            {t('buttons.newDiag')}
          </button>
        </div>
      </div>

      {/* Modal de guardar */}
      <SaveModal
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
      />

      {/* Modal de historial */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onEditDiagnosis={handleEditFromHistory}
          />
    </div>
  )
}