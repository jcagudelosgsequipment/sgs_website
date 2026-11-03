# Marca SGS

Fuente de verdad: `src/index.css` y `tailwind.config.ts`.

## Identidad

- Nombre: SGS Equipment. Razón extendida en correos: SGS Ground Support Equipment.
- Divisiones: SGS Equipment, SGS Rentals, GS Express.
- Logo raster: `public/SGS_LOGO.webp`.
- Marca de agua: `public/SGS watermark.png`.
- Logo en UI: `src/components/sgs/Logo.tsx` (monograma SGS sobre `bg-primary` + wordmark).

## Colorimetría

Valores en HSL sin `hsl()`. Tailwind: `bg-primary`, `text-accent`, `bg-industrial-navy`, etc.

| Token | HSL | Hex | Uso |
|---|---|---|---|
| `--primary` | 213 59% 26% | #1B3A6B | Azul industrial. Botones, logo, anillos |
| `--primary-foreground` | 0 0% 100% | #FFFFFF | Texto sobre primary |
| `--primary-glow` | 213 70% 40% | #1F5FAD | Brillo / énfasis azul |
| `--accent` | 18 92% 47% | #E8500A | Naranja de marca. Kickers, subrayados |
| `--accent-hover` | 18 92% 42% | #CD4409 | Hover del acento |
| `--accent-foreground` | 0 0% 100% | #FFFFFF | Texto sobre accent |
| `--industrial-navy` | 215 56% 12% | #0D1B2E | Fondos hero / secciones oscuras |
| `--industrial-navy-deep` | 215 60% 8% | #081221 | Fondo inferior del gradiente hero |
| `--industrial-slate` | 215 25% 65% | #94A3B8 | Texto secundario sobre oscuro |
| `--foreground` | 215 35% 12% | #141D29 | Texto principal |
| `--secondary` | 215 28% 17% | #1F2937 | Texto de apoyo del wordmark |
| `--background` | 0 0% 100% | #FFFFFF | Fondo de página |
| `--muted` | 210 20% 96% | #F3F5F7 | Superficies suaves |
| `--muted-foreground` | 215 16% 47% | #64748B | Texto muted |
| `--border` / `--input` | 214 25% 90% | #DFE5EC | Bordes e inputs |
| `--destructive` | 0 84% 60% | #EF4444 | Error |
| `--ring` | 213 59% 26% | #1B3A6B | Focus |

Naranja suelto en CTAs de equipo, rentals y hero: `#FF5500`, hover `#E64D00`. No está en los tokens. Los tokens usan `#E8500A`.

### Dark

| Token | HSL |
|---|---|
| `--background` | 215 56% 8% |
| `--foreground` | 0 0% 98% |
| `--primary` | 213 70% 55% |
| `--accent` | 18 92% 52% |
| `--border` | 215 30% 20% |

### Gradientes y sombra

- `--gradient-hero`: radial azul sobre navy → navy-deep.
- `--gradient-accent`: 135deg, accent → `hsl(18 95% 55%)`.
- `--shadow-glow`: acento, 20px 60px.
- `--shadow-card`: navy profundo.
- `--shadow-nav`: navy al 8%.
- Transición: `cubic-bezier(0.32, 0.72, 0, 1)`.

## Tipografía

- Familia: Inter. Fallback: `system-ui`, `sans-serif`.
- Carga: `index.html`, pesos 400, 500, 600, 700, 800, 900.
- `font-sans` y `font-display` son la misma pila. Display se usa en títulos.
- Body: `antialiased`, `font-feature-settings: "ss01", "cv11"`.

| Rol | Peso | Tracking | Tamaño |
|---|---|---|---|
| Hero | 800–900 | -0.03em / tight | 44px → 78px, leading 1.02 |
| H1 de página | 900 | tight | 36px → 60px, leading 1.1 |
| H2 de sección | 800 | tight | 30px → 44px |
| Kicker | 700, uppercase | 0.2em–0.25em | 10–12px, color accent |
| Cuerpo | 400–500 | normal | 14–16px |
| Wordmark | 900 + 600 | tight | 18px / 16px |

## Forma y layout

- Radio base: `0.625rem` (10px). `rounded-lg` = token, `rounded-md` −2px, `rounded-sm` −4px.
- Contenedor: centrado, padding `1.5rem`, max `1400px` desde `2xl`.
- CTAs pill del hero: `rounded-full`.
