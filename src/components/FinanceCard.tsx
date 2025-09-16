'use client'

import { FinancialMetrics, FinancialAlert, getROASColor, getROASBadgeColor } from '@/lib/financial'

interface FinanceCardProps {
  metrics: FinancialMetrics & { alerts: FinancialAlert[] }
}

export default function FinanceCard({ metrics }: FinanceCardProps) {
  const { roas, aov, cac, alerts } = metrics

  return (
    <div className="card bg-blue-50 border-blue-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          📊 Finanzas Rápidas
        </h3>
        <p className="text-blue-700 text-sm">
          Estimaciones generales; no contemplan atribución por canal ni márgenes
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-white rounded-lg">
          <div className={`text-2xl font-bold ${getROASColor(roas)}`}>
            {roas ? roas.toFixed(2) : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">ROAS</div>
          {roas && (
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getROASBadgeColor(roas)}`}>
              {roas >= 3 ? 'Excelente' : roas >= 2 ? 'Regular' : 'Bajo'}
            </div>
          )}
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {aov ? `$${aov.toFixed(2)}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">Ticket Medio (AOV)</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {cac ? `$${cac.toFixed(2)}` : 'N/A'}
          </div>
          <div className="text-sm text-gray-500">CAC Aprox.</div>
        </div>
      </div>

      {/* Alertas y recomendaciones */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-blue-900 text-sm">Alertas y Recomendaciones:</h4>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-sm ${
                alert.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : alert.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-start">
                <span className="mr-2">
                  {alert.type === 'success' ? '✅' : alert.type === 'warning' ? '⚠️' : '❌'}
                </span>
                <span>{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nota adicional */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-blue-800 text-xs">
          <strong>Tip:</strong> Si CAC ≥ 30% del AOV, revisá creativos, targeting o oferta.
        </p>
      </div>
    </div>
  )
}
