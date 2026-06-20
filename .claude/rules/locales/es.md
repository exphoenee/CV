# Español — Reglas lingüísticas del CV

Cubre los labels de `cv/locales/es.js` y cualquier contenido de CV en español.

---

## Registro y tono

- **Profesional, directo, seguro.** Ni demasiado formal ni coloquial.
- Primera persona activa: «Desarrollé», «Dirigí», «Implementé», «Diseñé».
- Evitar voz pasiva: ~~«fue desarrollado»~~ → «desarrollé».

## Tiempos verbales

| Contexto           | Tiempo                        | Ejemplo                               |
| ------------------ | ----------------------------- | ------------------------------------- |
| Puesto actual      | Presente                      | «Dirijo un equipo de 2 personas»      |
| Puestos anteriores | Pretérito indefinido          | «Desarrollé…», «Migré…», «Introduje…» |
| Resumen            | Presente + pretérito perfecto | «Me especializo en… He liderado…»     |

## Terminología técnica

- Los nombres de tecnologías permanecen en inglés: `TypeScript`, `Node.js`, `Svelte`, `React`, `MySQL`, `SCSS`.
- Género de los préstamos del inglés: «el framework», «la librería», «el pipeline», «el monorepo»
- Composición: «arquitectura frontend», «pipeline de CI», «componente de React»

## Errores frecuentes

- Confusión ser/estar: «Estoy especializado» (estado) vs. «Soy especialista» (identidad) — ambas válidas
- Leísmo: evitar «le desarrollé» → «lo desarrollé»
- Signos de apertura obligatorios: «¿…?» y «¡…!» — no omitir el signo inicial
- Tildes en palabras esdrújulas: «código», «técnico», «módulo», «página»
- Evitar «responsable de» → usar verbos de acción directa

## Labels UI (es.js)

- Botones: imperativo o infinitivo: «Enviar», «Cerrar», «Reservar reunión», «Imprimir»
- Tratamiento: **usted** implícito o tuteo consistente — elegir uno y mantenerlo
- Placeholders: culturalmente adaptados: `"María García"`, `"tu@email.es"`
- Mensajes de error: directos y neutros: «Este campo es obligatorio.»
- Mayúsculas: solo la primera letra de los títulos de sección (no Title Case)
- Puntuación en listas: sin punto final en ítems de lista cortos
