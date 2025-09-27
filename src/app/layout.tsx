import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import AuthProvider from '@/components/AuthProvider'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Diagnóstico E-commerce - Descubre dónde se pierde tu venta',
  description: 'Herramienta gratuita para diagnosticar problemas de conversión en tu tienda online. Obtén recomendaciones personalizadas en 2 minutos.',
  keywords: 'ecommerce, diagnóstico, conversión, tienda online, marketing digital',
  authors: [{ name: 'William Bastidas' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
