export type FinanceInsight = {
  level: 'critical' | 'fragile' | 'ok' | 'strong',
  headline: string,
  summary: string,
  actions: string[],
  notes?: string[]
};

export function evaluateFinance(
  { aov, roas, cac, ordersCount }:
  { aov: number, roas: number, cac: number, ordersCount: number }
): FinanceInsight {

  // Guardas
  if (!isFinite(aov) || !isFinite(roas) || !isFinite(cac)) {
    throw new Error('missing_finance_data');
  }

  // Microcopys estilo Maider
  const microcopys = {
    roas: `Por cada $1 que invertiste en anuncios, volvieron $${roas.toFixed(2)}.`,
    cac: `Cada pedido te costó $${cac.toFixed(2)} en publicidad.`,
    aov: `Tu ticket promedio fue de $${aov.toFixed(2)}.`
  };

  // Lógica simplificada basada en ROAS
  if (roas < 1) {
    return {
      level: 'critical',
      headline: microcopys.roas,
      summary: "Hoy tus anuncios no se pagan solos: por cada $1 invertido, recuperás menos de $1.\n💡 Revisa si tu página convence lo suficiente o si estás atrayendo al público correcto.",
      actions: [
        'Pausá lo que no vende: dejá solo el mejor anuncio por ángulo durante 72h.',
        'Arreglá la PDP: reescribí el hero en 1 línea y sumá 3 beneficios + 3 reseñas.',
        'Mostrá costos totales y políticas antes del pago para bajar abandono.'
      ],
      notes: [
        microcopys.cac,
        microcopys.aov,
        ordersCount < 10 ? 'Muestra chica: validá otra semana.' : ''
      ].filter(Boolean)
    };
  }

  if (roas >= 1 && roas < 2) {
    return {
      level: 'fragile',
      headline: microcopys.roas,
      summary: "Tus anuncios cubren su costo, pero todavía no dejan margen.\n🧠 Enfocá los próximos 7 días en mejorar una sola tasa (ATC o Checkout) para que el retorno crezca.",
      actions: [
        'Subí el ATC: clarificá valor en la PDP y agregá prueba social arriba.',
        'Bajá fricción de checkout: menos campos, costos sin sorpresa, contacto visible.',
        'Mejorá calidad de tráfico: 3 creatividades (dolor/beneficio/prueba) a PDP exacta.'
      ],
      notes: [
        microcopys.cac,
        microcopys.aov,
        ordersCount < 10 ? 'Muestra chica: validá otra semana.' : ''
      ].filter(Boolean)
    };
  }

  // roas >= 2
  // Verificar si CAC > AOV (problema de rentabilidad)
  if (cac > aov) {
    return {
      level: 'fragile',
      headline: microcopys.roas,
      summary: "Estás pagando más por conseguir un cliente de lo que te deja su compra.\n🧩 Revisá la oferta o el ticket promedio: subir precios, packs o umbral de envío gratis puede ayudarte.",
      actions: [
        'Aumentá AOV: bundling, packs y envío gratis desde umbral.',
        'Mejorá conversión (CR): ajustá mensaje del anuncio para alinear con la PDP.',
        'Negociá costos logísticos o medios de pago para mejorar margen efectivo.'
      ],
      notes: [
        microcopys.cac,
        microcopys.aov,
        ordersCount < 10 ? 'Muestra chica: validá otra semana.' : ''
      ].filter(Boolean)
    };
  }

  // Verificar si CAC ≈ AOV (empatando)
  if (Math.abs(cac - aov) / aov < 0.1) { // Diferencia menor al 10%
    return {
      level: 'ok',
      headline: microcopys.roas,
      summary: "Estás empatando: por cada cliente que ganás, lo que invertís en publicidad es casi igual a lo que te compra.\n🔁 Necesitás o mejorar conversión o subir valor del pedido.",
      actions: [
        'Subí ticket promedio (AOV): pack de 2–3 con beneficio real.',
        'Mantené la coherencia anuncio→PDP: mismo claim, misma promesa.',
        'Escalá de a poco vigilando Cart→Buy para no perder eficiencia.'
      ],
      notes: [
        microcopys.cac,
        microcopys.aov,
        ordersCount < 10 ? 'Muestra chica: validá otra semana.' : ''
      ].filter(Boolean)
    };
  }

  // roas >= 2 y CAC < AOV (todo bien)
  return {
    level: 'strong',
    headline: microcopys.roas,
    summary: "Buen trabajo: tus anuncios generan más de lo que cuestan.\n🚀 Podés escalar con cuidado, vigilando que tus tasas se mantengan estables.",
    actions: [
      'Duplicá creatividades manteniendo el claim ganador.',
      'Abrí audiencias lookalike sin tocar la promesa central.',
      'Sumá remarketing con prueba social y objeciones resueltas.'
    ],
    notes: [
      microcopys.cac,
      microcopys.aov,
      ordersCount < 10 ? 'Muestra chica: validá otra semana.' : ''
    ].filter(Boolean)
  };
}
