'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { calculateFinancialMetrics, FinancialMetrics } from '@/lib/financial'
import FinanceCard from './FinanceCard'

const financialSchema = z.object({
  sales_total: z.number().min(0, 'Las ventas deben ser mayor o igual a 0').optional().or(z.literal('')),
  ad_spend: z.number().min(0, 'El gasto en ads debe ser mayor o igual a 0').optional().or(z.literal('')),
  orders: z.number().min(0, 'El número de pedidos debe ser mayor o igual a 0').optional().or(z.literal('')),
})

type FinancialFormData = z.infer<typeof financialSchema>

interface FinancialAccordionProps {
  onFinancialData?: (data: FinancialMetrics) => void
}

export default function FinancialAccordion({ onFinancialData }: FinancialAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics & { alerts: any[] } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FinancialFormData>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      sales_total: '',
      ad_spend: '',
      orders: '',
    }
  })

  const onSubmit = async (data: FinancialFormData) => {
    setIsSubmitting(true)
    
    try {
      // Convertir strings vacíos a undefined
      const processedData = {
        sales_total: data.sales_total === '' ? undefined : data.sales_total,
        ad_spend: data.ad_spend === '' ? undefined : data.ad_spend,
        orders: data.orders === '' ? undefined : data.orders,
      }

      // Verificar que al menos hay 2 de los 3 datos para mostrar resultados
      const hasEnoughData = Object.values(processedData).filter(val => val !== undefined).length >= 2
      
      if (hasEnoughData) {
        const metrics = calculateFinancialMetrics(processedData)
        setFinancialMetrics(metrics)
        setShowResults(true)
        
        if (onFinancialData) {
          onFinancialData(processedData)
        }
      } else {
        alert('Necesitás al menos 2 de los 3 datos para calcular las métricas financieras')
      }
    } catch (error) {
      console.error('Error calculating financial metrics:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    setShowResults(false)
    setFinancialMetrics(null)
  }

  return (
    <div className="card bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between p-6 hover:bg-gray-100 rounded-xl transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Mejorá la precisión (opcional)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Si completás estos datos, te calculamos ROAS, ticket medio y CAC para ver si tus anuncios son sostenibles.
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <span className="text-gray-500 font-bold">
              {isOpen ? '−' : '+'}
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          {!showResults ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="form-group">
                  <label htmlFor="financial_sales_total" className="form-label">
                    💰 Ventas totales (USD)
                  </label>
                  <input
                    type="number"
                    id="financial_sales_total"
                    {...register('sales_total', { 
                      setValueAs: (value) => value === '' ? undefined : Number(value)
                    })}
                    className="input-field"
                    placeholder="Ej: 5000"
                  />
                  {errors.sales_total && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.sales_total.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="financial_ad_spend" className="form-label">
                    📢 Gasto en publicidad (USD)
                  </label>
                  <input
                    type="number"
                    id="financial_ad_spend"
                    {...register('ad_spend', { 
                      setValueAs: (value) => value === '' ? undefined : Number(value)
                    })}
                    className="input-field"
                    placeholder="Ej: 1000"
                  />
                  {errors.ad_spend && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.ad_spend.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="financial_orders" className="form-label">
                    📦 Número de pedidos
                  </label>
                  <input
                    type="number"
                    id="financial_orders"
                    {...register('orders', { 
                      setValueAs: (value) => value === '' ? undefined : Number(value)
                    })}
                    className="input-field"
                    placeholder="Ej: 25"
                  />
                  {errors.orders && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.orders.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Calcular finanzas rápidas
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center bg-white p-3 rounded-lg border border-gray-200">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Estimaciones sin atribución por canal. Úsalas como guía.
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              {financialMetrics && <FinanceCard metrics={financialMetrics} />}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Calcular con otros datos
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
