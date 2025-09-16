'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { trackSalesPageView, trackSalesPageCtaClick } from '@/lib/analytics'

export default function MentoriaPage() {
  useEffect(() => {
    trackSalesPageView()
  }, [])

  const handleCtaClick = () => {
    trackSalesPageCtaClick()
  }

  return (
    <main className="container-mobile py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Programa de Mentoría 1:1
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Transforma tu e-commerce en 30 días con estrategias probadas
        </p>
        <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full inline-block text-lg font-semibold">
          USD 247 - Pago único
        </div>
      </div>

      {/* Problem Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Tu tienda online no vende como esperabas?
        </h2>
        <p className="text-gray-600 mb-4">
          Si estás aquí, probablemente tu tienda tiene uno de estos problemas:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">❌</span>
            Pocas visitas y no sabes cómo atraer más tráfico
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">❌</span>
            Tienes visitas pero no se convierten en ventas
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">❌</span>
            Los clientes abandonan el carrito de compras
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">❌</span>
            No sabes qué métricas importan realmente
          </li>
        </ul>
      </div>

      {/* Solution Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          La solución: Mentoría personalizada 1:1
        </h2>
        <p className="text-gray-600 mb-6">
          Trabajaremos juntos para identificar y solucionar los problemas específicos de tu tienda.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">✅ Para quién es</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Dueños de tiendas con marca propia</li>
              <li>• 0-50 pedidos por mes</li>
              <li>• Sin equipo técnico dedicado</li>
              <li>• Presupuesto limitado para marketing</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">❌ No es para</h3>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Dropshipping genérico</li>
              <li>• Tiendas con +100 pedidos/mes</li>
              <li>• Empresas con equipo técnico</li>
              <li>• Quienes buscan resultados mágicos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* What You'll Get Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ¿Qué obtienes en 30 días?
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Auditoría completa de tu tienda</h3>
              <p className="text-gray-600">Analizaremos tu sitio web, productos, precios y experiencia de usuario para identificar oportunidades de mejora.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Estrategia de marketing personalizada</h3>
              <p className="text-gray-600">Desarrollaremos un plan específico para tu nicho, incluyendo SEO, redes sociales y publicidad pagada.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Optimización de conversión</h3>
              <p className="text-gray-600">Mejoraremos tu proceso de checkout, descripciones de productos y llamadas a la acción para aumentar las ventas.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguimiento y ajustes</h3>
              <p className="text-gray-600">Revisaremos métricas semanalmente y ajustaremos la estrategia según los resultados obtenidos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Entregables incluidos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">Reporte de auditoría detallado</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">Plan de marketing 90 días</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">Templates de contenido</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">Configuración de analytics</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">Acceso a grupo privado</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500 mr-3">✓</span>
            <span className="text-gray-700">Soporte por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-primary-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">
          ¿Listo para transformar tu tienda?
        </h2>
        <p className="text-primary-100 mb-6">
          Reserva tu llamada de 15 minutos para ver si somos compatibles
        </p>
        <Link
          href="/agenda"
          onClick={handleCtaClick}
          className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-block transition-colors duration-200"
        >
          Agendar llamada gratuita
        </Link>
        <p className="text-primary-200 text-sm mt-4">
          Sin compromiso • 15 minutos • 100% gratuito
        </p>
      </div>

      {/* Back to Diagnosis */}
      <div className="text-center mt-8">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Volver al diagnóstico
        </Link>
      </div>
    </main>
  )
}
