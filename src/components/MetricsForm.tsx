'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { trackDiagnosisStart, trackDiagnosisSubmit } from '@/lib/analytics'

const metricsSchema = z.object({
  visits: z.number().min(0, 'Las visitas deben ser mayor o igual a 0'),
  carts: z.number().min(0, 'Los carritos deben ser mayor o igual a 0'),
  purchases: z.number().min(0, 'Las compras deben ser mayor o igual a 0'),
  month: z.string().min(1, 'El mes es requerido'),
  sales_total: z.any().optional(),
  ad_spend: z.any().optional(),
  orders: z.any().optional(),
})

type MetricsFormData = z.infer<typeof metricsSchema>

interface MetricsFormProps {
  onDiagnosis: (visits: number, carts: number, purchases: number) => void
}

export default function MetricsForm({ onDiagnosis }: MetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<MetricsFormData>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      visits: 0,
      carts: 0,
      purchases: 0,
    }
  })

  const watchedValues = watch()
  const visits = watchedValues.visits || 0
  const carts = watchedValues.carts || 0
  const purchases = watchedValues.purchases || 0

  // Calculate metrics in real-time
  const cv = visits ? (carts / visits) * 100 : 0
  const cc = carts ? (purchases / carts) * 100 : 0
  const tc = visits ? (purchases / visits) * 100 : 0

  const onSubmit = async (data: MetricsFormData) => {
    console.log('📝 Datos del formulario:', data)
    setIsSubmitting(true)
    
    try {
      // Track form submission
      trackDiagnosisStart()
      trackDiagnosisSubmit(data.visits, data.carts, data.purchases)
      
      // Trigger diagnosis
      onDiagnosis(data.visits, data.carts, data.purchases)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
            Mes del diagnóstico
          </label>
          <input
            type="month"
            id="month"
            {...register('month')}
            className="input-field"
          />
          {errors.month && (
            <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="visits" className="block text-sm font-medium text-gray-700 mb-2">
              Visitas únicas
            </label>
            <input
              type="number"
              id="visits"
              {...register('visits', { valueAsNumber: true })}
              className="input-field"
              placeholder="Ej: 1000"
            />
            {errors.visits && (
              <p className="mt-1 text-sm text-red-600">{errors.visits.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="carts" className="block text-sm font-medium text-gray-700 mb-2">
              Carritos abandonados
            </label>
            <input
              type="number"
              id="carts"
              {...register('carts', { valueAsNumber: true })}
              className="input-field"
              placeholder="Ej: 50"
            />
            {errors.carts && (
              <p className="mt-1 text-sm text-red-600">{errors.carts.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="purchases" className="block text-sm font-medium text-gray-700 mb-2">
              Compras completadas
            </label>
            <input
              type="number"
              id="purchases"
              {...register('purchases', { valueAsNumber: true })}
              className="input-field"
              placeholder="Ej: 10"
            />
            {errors.purchases && (
              <p className="mt-1 text-sm text-red-600">{errors.purchases.message}</p>
            )}
          </div>
        </div>

        {/* Optional fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Campos opcionales (para análisis más preciso)</h3>
          
          <div>
            <label htmlFor="sales_total" className="block text-sm font-medium text-gray-700 mb-2">
              Ventas totales (USD)
            </label>
            <input
              type="number"
              id="sales_total"
              {...register('sales_total', { 
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              className="input-field"
              placeholder="Ej: 5000"
            />
          </div>

          <div>
            <label htmlFor="ad_spend" className="block text-sm font-medium text-gray-700 mb-2">
              Gasto en publicidad (USD)
            </label>
            <input
              type="number"
              id="ad_spend"
              {...register('ad_spend', { 
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              className="input-field"
              placeholder="Ej: 1000"
            />
          </div>

          <div>
            <label htmlFor="orders" className="block text-sm font-medium text-gray-700 mb-2">
              Número de pedidos
            </label>
            <input
              type="number"
              id="orders"
              {...register('orders', { 
                setValueAs: (value) => value === '' ? undefined : Number(value)
              })}
              className="input-field"
              placeholder="Ej: 25"
            />
          </div>
        </div>

        {/* Real-time metrics preview */}
        {visits > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Métricas calculadas:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">% CV:</span>
                <span className="ml-1 font-medium">{cv.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">% CC:</span>
                <span className="ml-1 font-medium">{cc.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">% TC:</span>
                <span className="ml-1 font-medium">{tc.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Analizando...' : 'Obtener Diagnóstico'}
        </button>
      </form>
    </div>
  )
}
