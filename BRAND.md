# Sistema de Marca Personal — William Bastidas / Radar E-commerce

## Paleta de Colores

| Rol | Nombre | HEX | Uso |
|-----|--------|-----|-----|
| **Primary** | Obsidian | `#1C1917` | Fondos oscuros, textos principales, botones CTA |
| **Secondary** | Warm Stone | `#44403C` | Textos secundarios, fondos suaves |
| **Accent / CTA** | Deep Gold | `#CA8A04` | Resaltados, subrayados, íconos clave, detalles |
| **Gold Light** | Warm Gold | `#F59E0B` | Versión más brillante para redes sociales |
| **Background** | Ivory | `#FAFAF9` | Fondos claros, posts en blanco |
| **Neutral** | Warm White | `#F5F5F4` | Fondos de cards, espacios |
| **Text Dark** | Near Black | `#0C0A09` | Texto principal sobre fondos claros |

> En Canva: Brand Kit → Colores → pegá cada HEX. Guardá como paleta "Personal Brand".

---

## Tipografía

| Rol | Fuente | Peso | Buscar en Canva |
|-----|--------|------|-----------------|
| **Títulos / Display** | Bodoni Moda | Bold (700) / Semibold (600) | `"Bodoni"` → elegí *Bodoni Moda* |
| **Subtítulos / UI** | Jost | Medium (500) / Regular (400) | `"Jost"` |
| **Cuerpo largo** | Jost | Light (300) / Regular (400) | `"Jost"` |
| **Alternativa body** | DM Sans | Regular / Medium | `"DM Sans"` |

### Reglas de uso
- Nunca usar más de 2 fuentes en una misma pieza
- Bodoni Moda → solo para títulos grandes e impactantes
- Jost → todo lo demás (labels, botones, párrafos, captions)
- Letter spacing en subtítulos pequeños: `+50 a +100` en Canva (estilo "tracking wide")

---

## Logo — Concepto

### Variante A — Monograma WB (más personal)
- Letras `WB` en **Bodoni Moda Bold**, stacked o side by side
- Línea o rectángulo delgado en gold debajo
- Fondo `#1C1917` · Letras `#FAFAF9` · Detalle `#CA8A04`
- Forma contenedora: cuadrado redondeado o círculo

### Variante B — Ícono + nombre (más profesional)
- Ícono minimal de radar/pulso: círculos concéntricos con punto central en gold
- `William Bastidas` en Jost Light + `RADAR E-COMMERCE` en Jost 300 tracking wide
- Fondo ivory · Texto dark · Línea separadora gold

> En Canva buscar template base: "monogram logo" o "minimal personal brand logo"

---

## Sistema de Consistencia para Redes

### Foto de perfil / Avatar
- Fondo sólido `#1C1917` o ivory
- Foto con tratamiento de color consistente (mismo filtro siempre, tono warm)
- O el logo sobre fondo oscuro

### Templates a crear en Canva (guardar en Brand Kit)
- [ ] Post cuadrado 1:1 — versión oscura + versión clara
- [ ] Historia vertical 9:16
- [ ] Carousel — cover + slides
- [ ] Banner LinkedIn (1584 × 396 px)
- [ ] Banner Twitter/X (1500 × 500 px)

### Regla de composición
- Margen mínimo: 10% del ancho en todos los lados
- Gold solo para **UN elemento por pieza** (el que debe llamar la atención)
- Fotos/imágenes siempre en tono warm (evitar azules fríos o verdes saturados)
- Espaciado generoso = percepción de marca premium

### Tono visual por red
| Red | Estilo | Fondo preferido |
|-----|--------|-----------------|
| **LinkedIn** | Profesional, datos, métricas | Ivory claro |
| **Instagram** | Premium, impacto visual | Obsidian oscuro + gold |
| **Twitter/X** | Directo, texto puro | Sin ornamentos |

### El "asset unificador"
Una **línea horizontal gold** (`#CA8A04`) de 2–3px que uses como separador en todos los diseños.
Es el elemento que hace que todo se vea del mismo sistema aunque el layout varíe.

---

## Correspondencia con el código del proyecto

Los mismos valores están aplicados en:
- `src/styles/globals.css` — variables de color, sombras, animaciones
- `src/app/layout.tsx` — fuentes Bodoni Moda + Jost via next/font/google
- `src/components/Header.tsx` — gradiente stone-900 → amber-700
- `src/app/page.tsx` — badge amber, CTA amber-600


Estilo Hero-Centric con Luxury/Premium Brand