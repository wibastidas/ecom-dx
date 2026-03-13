import type { Metadata } from 'next'
import { Bodoni_Moda, Jost } from 'next/font/google'
import '../styles/globals.css'
import AuthProvider from '@/components/AuthProvider'
import ToastProvider from '@/components/ToastProvider'

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Radar E-commerce - Diagnóstico de Conversión',
  description: 'Herramienta gratuita para diagnosticar problemas de conversión en tu tienda online. Obtén recomendaciones personalizadas en 2 minutos.',
  keywords: 'ecommerce, diagnóstico, conversión, tienda online, marketing digital',
  authors: [{ name: 'William Bastidas' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
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
      <body className={`${bodoniModa.variable} ${jost.variable}`}>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen relative">
              {/* Aurora background blobs */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
                <div className="aurora-blob absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-300/20 blur-3xl" />
                <div className="aurora-blob absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-stone-400/15 blur-3xl" style={{ animationDelay: '4s' }} />
                <div className="aurora-blob absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-yellow-300/12 blur-3xl" style={{ animationDelay: '8s' }} />
              </div>
              {children}
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
