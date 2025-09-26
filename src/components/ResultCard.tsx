'use client'

import { useState } from 'react'
import { DiagnosisResult } from '@/lib/diagnosis'
import { evaluateFinance, FinanceInsight } from '@/lib/finance'
import useTranslations from '@/hooks/useTranslations'
import Tooltip from './Tooltip'

interface ResultCardProps {
  result: DiagnosisResult
  onNewDiagnosis: () => void
  onEditData: () => void
}

export default function ResultCard({ result, onNewDiagnosis, onEditData }: ResultCardProps) {
  const { t } = useTranslations()
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Determinar el mensaje según el diagnóstico
  const getMessage = (dx: string) => {
    const messages = {
      trafico: 'necesita más visitantes',
      oferta_web: 'convierte bien pero pocos llegan al carrito',
      checkout: 'tiene muchos carritos pero pocos se completan',
      escalar: 'está lista para crecer'
    }
    return messages[dx as keyof typeof messages] || 'necesita optimización'
  }

  // Obtener el CTA del microcurso según el diagnóstico
  const getMicrocourseCta = (dx: string) => {
    const ctas = {
      trafico: t('cta.mcTraffic'),
      oferta_web: t('cta.mcPdp'),
      checkout: t('cta.mcCheckout'),
      escalar: t('cta.mcScale')
    }
    return ctas[dx as keyof typeof ctas] || t('cta.mcTraffic')
  }

  // Obtener la interpretación de comunicación según el diagnóstico
  const getCommunicationInsight = (dx: string) => {
    const insights = {
      trafico: t('result.commTraffic'),
      oferta_web: t('result.commATC'),
      checkout: t('result.commCB'),
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
      oferta_web: [
        'Subí el ATC: clarificá valor en la PDP y agregá prueba social arriba.',
        'Bajá fricción de checkout: menos campos, costos sin sorpresa, contacto visible.',
        'Mejorá calidad de tráfico: 3 creatividades (dolor/beneficio/prueba) a PDP exacta.'
      ],
      checkout: [
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
  let financeInsight: FinanceInsight | null = null
  let hasFinanceData = false

  if (result.aov && result.roas && result.cac) {
    try {
      // Necesitamos el ordersCount, lo calculamos desde los datos básicos
      const ordersCount = result.cr > 0 ? Math.round(result.cr * 100) : 0 // Aproximación
      financeInsight = evaluateFinance({
        aov: result.aov,
        roas: result.roas,
        cac: result.cac,
        ordersCount
      })
      hasFinanceData = true
    } catch (error) {
      console.log('No hay datos financieros completos')
    }
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
      {hasFinanceData && financeInsight ? (
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
            financeInsight.level === 'critical' ? 'bg-red-50 border-red-200' :
            financeInsight.level === 'fragile' ? 'bg-yellow-50 border-yellow-200' :
            financeInsight.level === 'ok' ? 'bg-blue-50 border-blue-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                financeInsight.level === 'critical' ? 'bg-red-100 text-red-800' :
                financeInsight.level === 'fragile' ? 'bg-yellow-100 text-yellow-800' :
                financeInsight.level === 'ok' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {t(`finance.level.${financeInsight.level}`)}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {financeInsight.headline}
          </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {financeInsight.summary}
              </p>
            </div>
            
            {/* Microcopys y Notas */}
            <div className="space-y-3">
              {/* Microcopys estilo Maider */}
              {financeInsight.notes && financeInsight.notes.filter(note => 
                note.includes('Por cada $') || note.includes('Cada pedido') || note.includes('Tu ticket')
              ).map((note, index) => (
                <p key={index} className="text-sm text-gray-700 font-medium">
                  {note}
                </p>
              ))}
              
              {/* Nota de margen */}
              <p className="text-sm text-gray-600 italic">
                {t('finance.notes.caveatMargin')}
              </p>
              
              {/* Nota de muestra pequeña */}
              {financeInsight.notes && financeInsight.notes.some(note => note.includes('Muestra chica')) && (
                <p className="text-sm text-gray-600 italic">
                  {t('finance.notes.smallSample')}
                </p>
              )}
            </div>
          </div>

          {/* Acciones financieras */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('finance.actionsTitleFinance')}
            </h3>
          <div className="space-y-3">
              {financeInsight.actions.map((action, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{action}</p>
                </div>
              ))}
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
            onClick={() => setShowSaveDialog(true)}
            className="btn-outline"
          >
            {t('buttons.loginSave')}
          </button>
          <button 
            onClick={onNewDiagnosis}
            className="btn-outline"
          >
            {t('buttons.newDiag')}
          </button>
        </div>
      </div>
    </div>
  )
}