'use client'

import { FinancialMetrics, FinancialAlert, getROASColor, getROASBadgeColor } from '@/lib/financial'
import { formatCurrency } from '@/lib/formatters'

interface FinanceCardProps {
  metrics: FinancialMetrics & { alerts: FinancialAlert[] }
}

export default function FinanceCard({ metrics }: FinanceCardProps) {
  const { roas, aov, cac, alerts } = metrics

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          📊 Finanzas Rápidas
        </h3>
        <p className="text-gray-600 text-sm">
          Estimaciones generales; no contemplan atribución por canal ni márgenes
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className={`text-3xl font-bold mb-2 ${getROASColor(roas || null)}`}>
            {roas ? roas.toFixed(2) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500 font-medium mb-2">ROAS</div>
          {roas && (
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getROASBadgeColor(roas)}`}>
              {roas >= 3 ? 'Excelente' : roas >= 2 ? 'Regular' : 'Bajo'}
            </div>
          )}
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {aov ? `$${formatCurrency(aov)}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500 font-medium">Ticket Medio (AOV)</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {cac ? `$${formatCurrency(cac)}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500 font-medium">CAC Aprox.</div>
        </div>
      </div>

      {/* Alertas y recomendaciones */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Alertas y Recomendaciones
          </h4>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-sm border-l-4 ${
                alert.type === 'success' 
                  ? 'bg-green-50 text-green-800 border-green-400'
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 text-yellow-800 border-yellow-400'
                  : 'bg-red-50 text-red-800 border-red-400'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {alert.type === 'success' ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : alert.type === 'warning' ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nota adicional */}
      <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-700 text-sm">
              <strong className="text-gray-900">Tip:</strong> Si CAC ≥ 30% del AOV, revisá creativos, targeting o oferta.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
