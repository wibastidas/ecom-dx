/**
 * Plataformas de e-commerce para el selector del formulario.
 * Solo dos modos de ayuda: Shopify (rutas exactas) y General (términos universales).
 */
export type Platform = 'shopify' | 'woocommerce' | 'tiendanube' | 'vtex' | 'custom'

export const PLATFORM_OPTIONS: { value: Platform; labelKey: string }[] = [
  { value: 'shopify', labelKey: 'platforms.options.shopify' },
  { value: 'woocommerce', labelKey: 'platforms.options.woocommerce' },
  { value: 'tiendanube', labelKey: 'platforms.options.tiendanube' },
  { value: 'custom', labelKey: 'platforms.options.custom' },
]

/** Modo de ayuda: shopify = rutas exactas; general = cualquier otra plataforma */
export function getHelpMode(platform: Platform): 'shopify' | 'general' {
  return platform === 'shopify' ? 'shopify' : 'general'
}

/** URL del CTA principal "Entrar al entrenamiento" → siempre el grupo WhatsApp Radar eCommerce */
export const CTA_WHATSAPP_URL = 'https://chat.whatsapp.com/Bn6QyyZwvmVFFcsL0Kb9jj'
