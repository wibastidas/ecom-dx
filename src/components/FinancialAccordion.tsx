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
    <div className="card bg-gray-50 border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div>
          <h3 className="font-semibold text-gray-900">
            Mejorá la precisión (opcional)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Si completás estos datos, te calculamos ROAS, ticket medio y CAC para ver si tus anuncios son sostenibles.
          </p>
        </div>
        <span className="text-gray-500">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {!showResults ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="financial_sales_total" className="block text-sm font-medium text-gray-700 mb-2">
                    Ventas totales (USD)
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
                    <p className="mt-1 text-sm text-red-600">{errors.sales_total.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="financial_ad_spend" className="block text-sm font-medium text-gray-700 mb-2">
                    Gasto en publicidad (USD)
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
                    <p className="mt-1 text-sm text-red-600">{errors.ad_spend.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="financial_orders" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de pedidos
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
                    <p className="mt-1 text-sm text-red-600">{errors.orders.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isSubmitting ? 'Calculando...' : 'Calcular finanzas rápidas'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Estimaciones sin atribución por canal. Úsalas como guía.
              </p>
            </form>
          ) : (
            <div className="space-y-4">
              {financialMetrics && <FinanceCard metrics={financialMetrics} />}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  className="btn-secondary flex-1"
                >
                  Calcular con otros datos
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-primary"
                >
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
