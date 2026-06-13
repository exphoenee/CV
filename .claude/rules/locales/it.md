# Italiano — Regole linguistiche CV

Copre i label di `scripts/locales/it.js` e qualsiasi contenuto CV in italiano.

---

## Registro e tono

- **Professionale, diretto, sicuro.** Né eccessivamente formale né colloquiale.
- Prima persona attiva: «Ho sviluppato», «Ho guidato», «Ho implementato», «Ho progettato».
- Evitare la voce passiva: ~~«è stato sviluppato»~~ → «ho sviluppato».

## Tempi verbali

| Contesto | Tempo | Esempio |
|---|---|---|
| Posizione attuale | Presente | «Guido un team di 2 persone» |
| Posizioni precedenti | Passato prossimo | «Ho sviluppato…», «Ho migrato…» |
| Sommario | Presente + passato prossimo | «Mi specializzo in… Ho guidato…» |

## Terminologia tecnica

- I nomi delle tecnologie rimangono in inglese: `TypeScript`, `Node.js`, `Svelte`, `React`, `MySQL`, `SCSS`.
- Genere dei prestiti dall'inglese: «il framework», «la libreria», «il pipeline», «il monorepo»
- Composizione: «architettura frontend», «pipeline CI», «componente React»
- Apostrofo: usare solo dove grammaticalmente necessario, non per i possessivi dei termini inglesi

## Errori frequenti

- Accordo participio passato con ausiliare avere: «ho sviluppato» (invariabile), «sono andato» (variabile)
- Apostrofo vs. accento: «è» (è = verbo) vs. «e» (e = congiunzione)
- Accenti sulle parole tronche: «città», «qualità», «università»
- Evitare «responsabile di» → usare verbi d'azione diretti
- Maiuscole errate: in italiano si usa meno il Title Case rispetto all'inglese

## Label UI (it.js)

- Pulsanti: imperativo o infinito: «Invia», «Chiudi», «Prenota una riunione», «Stampa»
- Trattamento: **lei** (formale) o **tu** (informale) — scegliere e mantenere la coerenza
- Placeholder: culturalmente adattati: `"Mario Rossi"`, `"tua@email.it"`
- Messaggi di errore: diretti e neutri: «Questo campo è obbligatorio.»
- Maiuscole: solo la prima lettera delle intestazioni di sezione (non Title Case)
- Virgolette: «…» (caporali) per le citazioni formali, "…" per l'uso comune