import esTranslations from '@/i18n/es.json'

type TranslationKeys = typeof esTranslations

export function useTranslations() {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = esTranslations
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    let result = value || key
    
    // Handle interpolation
    if (params && typeof result === 'string') {
      Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`{{${param}}}`, 'g'), String(params[param]))
      })
    }
    
    return result
  }

  return { t }
}

export default useTranslations
