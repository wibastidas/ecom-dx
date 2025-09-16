'use client'

import { useEffect } from 'react'
import { trackCalendarView, trackCalendarBooked } from '@/lib/analytics'

export default function AgendaPage() {
  useEffect(() => {
    trackCalendarView()
  }, [])

  // This would be your actual Calendly URL
  const CALENDLY_URL = "https://calendly.com/williambastidas/mentoria-ecommerce"

  return (
    <main className="container-mobile py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Agenda tu llamada gratuita
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Reserva 15 minutos para evaluar si somos compatibles
        </p>
        <p className="text-sm text-gray-500">
          Sin compromiso • 100% gratuito • Resultados garantizados
        </p>
      </div>

      {/* Calendly Embed */}
      <div className="card">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="font-semibold text-gray-900 mb-2">
            ¿Qué esperar en la llamada?
          </h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Revisaremos tu diagnóstico actual</li>
            <li>• Identificaremos las 3 prioridades más importantes</li>
            <li>• Te daré 2-3 acciones específicas para implementar</li>
            <li>• Evaluaremos si la mentoría es adecuada para ti</li>
          </ul>
        </div>

        {/* Calendly iframe */}
        <div className="relative w-full" style={{ height: '700px' }}>
          <iframe
            src={CALENDLY_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Calendly - Agendar llamada"
            onLoad={() => {
              // Track when the calendar is loaded
              console.log('Calendar loaded')
            }}
            className="rounded-lg"
          />
        </div>

        {/* Fallback message if iframe doesn't load */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>¿No puedes ver el calendario?</strong> Haz clic en el enlace directo: 
            <a 
              href={CALENDLY_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline ml-1"
            >
              Abrir en nueva ventana
            </a>
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Información importante
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-green-500 mr-3 mt-1">✓</span>
            <div>
              <h3 className="font-medium text-gray-900">Duración</h3>
              <p className="text-gray-600 text-sm">15 minutos exactos, respetamos tu tiempo</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-green-500 mr-3 mt-1">✓</span>
            <div>
              <h3 className="font-medium text-gray-900">Preparación</h3>
              <p className="text-gray-600 text-sm">Solo necesitas tener tu diagnóstico listo</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-green-500 mr-3 mt-1">✓</span>
            <div>
              <h3 className="font-medium text-gray-900">Resultado</h3>
              <p className="text-gray-600 text-sm">Saldrás con 2-3 acciones específicas para implementar</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="text-green-500 mr-3 mt-1">✓</span>
            <div>
              <h3 className="font-medium text-gray-900">Seguimiento</h3>
              <p className="text-gray-600 text-sm">Te enviaré un resumen por email después de la llamada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Diagnosis */}
      <div className="text-center mt-8">
        <a
          href="/"
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Volver al diagnóstico
        </a>
      </div>
    </main>
  )
}
