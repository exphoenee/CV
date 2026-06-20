export const IT = {
  content: {
    summary:
      "Ingegnere e Tech Lead con oltre 5 anni di esperienza nello sviluppo software e 13 anni nell'ingegneria industriale, specializzato in sviluppo assistito dall'IA, automazione dei dati e progettazione di sistemi con TypeScript, Node.js, Python e SQL. Ho introdotto flussi di lavoro di sviluppo guidati dall'IA e costruito pipeline CI con quality gate automatizzati. Ho automatizzato flussi di dati e processi di reportistica, costruito sistemi di reportistica giornaliera via email e interfacce di visualizzazione dati in tempo reale, e contribuito a piattaforme per il tracciamento della conformità ambientale. Guido e mentoro ingegneri, concentrandomi su una consegna di soluzioni analitica, strutturata e basata su evidenze tra i team.",
    workExperience: [
      {
        id: 'aegex',
        description:
          "Ho guidato la modernizzazione architetturale di SafeSy e FACTS con piena responsabilità end-to-end: progettazione del sistema, architettura frontend e integrazione backend. Workflow assistiti dall'IA e pipeline CI hanno migliorato significativamente velocità di consegna e affidabilità dei release.",
        bullets: [
          'Ho preso in carico architettura e consegna di due sistemi aziendali (SafeSy, FACTS) dal design alla produzione',
          'Ho guidato la modernizzazione di sistemi legacy tramite riscritture complete e migrazione verso stack frontend moderni',
          "Ho introdotto flussi di lavoro di sviluppo assistiti dall'IA migliorando la produttività e la coerenza del team",
          'Ho implementato un pipeline CI con quality gate automatizzati e strategia di test da zero',
          'Ho stabilito un processo di refactoring basato su evidenze con miglioramenti della qualità misurabili',
          'Sto attualmente mentorando e guidando 1 ingegnere di livello intermedio',
        ],
        projects: [
          {
            name: 'SafeSy',
            subtitle: 'Sistema interno di gestione della produzione',
            bullets: [
              'Piattaforma aziendale multi-ruolo (produzione, ufficio, dirigenti, partner) con tracciamento in tempo reale di workflow e inventario',
              'Libreria di componenti Svelte interna riutilizzabile progettata e implementata per tutta la piattaforma',
              'Ho automatizzato i processi di reportistica con un sistema di reportistica giornaliera via email sottoscrivibile, e ho integrato fonti dati tramite il backend Express (progettazione e ottimizzazione delle query SQL)',
            ],
          },
          {
            name: 'FACTS',
            subtitle: 'Sistema di tracciamento materie prime e conformità',
            bullets: [
              "Ciclo di release ridotto da mensile a bisettimanale (obiettivo: settimanale) con workflow assistiti dall'IA (tooling Claude)",
              'Pipeline CI con quality gate automatizzati introdotta; copertura dei test stabilita da zero, problemi in produzione ridotti significativamente',
              'Architettura migrata verso monorepo PNPM, pacchetto condiviso FACTS/Driver estratto',
              'Tooling CLI interno sviluppato per automazione workflow monorepo e produttività degli sviluppatori',
            ],
          },
        ],
      },
      {
        id: 'telekom',
        description:
          "Ho lavorato in un ambiente Agile aziendale su un sistema frontend integrato con l'IA, focalizzato sulla visualizzazione di dati in tempo reale e l'integrazione frontend-backend. Ho costruito componenti UI type-safe e contribuito ai workflow di test guidati dall'IA e alle interfacce di analisi.",
        bullets: [
          "Ho sviluppato componenti UI React type-safe per sistemi aziendali integrati con l'IA",
          "Ho integrato interfacce frontend con servizi backend guidati dall'IA tramite API",
          "Ho costruito interfacce di visualizzazione dati e dashboard in tempo reale per il monitoraggio dei risultati dei test e l'analisi di sistema",
          'Ho lavorato in consegna Agile con integrazione continua di frontend e backend',
        ],
      },
      {
        id: 'scolia',
        description:
          "Ho sviluppato interfacce frontend in tempo reale per una piattaforma automatizzata di punteggio e analisi sportiva. Mi sono concentrato su aggiornamenti UI a bassa latenza, visualizzazione di dati in tempo reale ed esperienza utente responsive in un ambiente di dati ad alta frequenza.",
        bullets: [
          'Ho costruito una UI React in tempo reale per il punteggio sportivo dal vivo',
          'Ho implementato componenti di visualizzazione a bassa latenza per analisi dal vivo',
          "Ho integrato flussi WebSocket in tempo reale nell'architettura frontend",
          'Con design e backend, ho consegnato UI a bassa latenza sotto carico dal vivo',
        ],
      },
      {
        id: 'cubicfox',
        description:
          'Ho consegnato applicazioni frontend di qualità produzione per clienti internazionali in un ambiente Agile. Mi sono concentrato su architettura UI scalabile, standard frontend e miglioramento della chiarezza dei requisiti tra stakeholder e team di sviluppo.',
        bullets: [
          'Ho costruito applicazioni React e Next.js pronte per la produzione per clienti internazionali',
          "Ho migliorato la coerenza dell'architettura frontend con standard di codice nel team",
          "Ho riprogettato la raccolta dei requisiti dei clienti, riducendo l'ambiguità",
          'Ho collaborato con design e backend su sistemi UI scalabili e multi-browser',
        ],
      },
      {
        id: 'cobotx',
        description:
          'Ho guidato progetti di ingegneria in robotica industriale e automazione, collegando ingegneria meccanica, sistemi PLC e automazione guidata da software. Ero responsabile della specifica dei sistemi, della guida del team e della pianificazione delle consegne in ambienti critici per la produzione.',
        bullets: [
          'Ho sviluppato specifiche hardware e software per sistemi basati su PLC',
          'Ho definito requisiti tecnici e studi di fattibilità per robotica industriale',
          'Ho costituito e guidato un team di 4 ingegneri, supervisionando la consegna',
          'Ho stabilito KPI, standard di documentazione e processi di reportistica automatizzati per le operazioni di ingegneria',
          'Ho creato piani di capacità e finanziari allineati alle previsioni',
        ],
      },
      {
        id: 'webforsol',
        description:
          'Ho consegnato applicazioni web full-stack come sviluppatore indipendente per clienti di più settori. Mi sono concentrato su progettazione di sistemi, architettura manutenibile e consegna end-to-end di soluzioni web scalabili.',
        bullets: [
          'Ho costruito applicazioni full-stack con React, Next.js, Node.js, PHP e database relazionali/non relazionali',
          'Ho progettato API REST e architetture backend modulari per i clienti',
          "Ho consegnato sviluppo prodotto end-to-end dall'analisi al deployment",
          'Ho lavorato direttamente con i clienti per tradurre esigenze aziendali in soluzioni tecniche scalabili',
          'Ho ottimizzato la struttura delle applicazioni per manutenibilità, estensibilità e scalabilità a lungo termine',
        ],
      },
    ],
    community:
      "Ho avviato e attualmente guido un club scolastico gratuito di informatica e programmazione come volontario presso la Scuola Primaria di Via Mátyás Király a Pécs (febbraio 2026, in corso). Ho progettato l'intero programma didattico. Sotto la mia mentorship, il team ha vinto il 1° posto al concorso «Hack and Code» 2026 (Radnóti SZKI) e si è classificato 1° e 3° al 22° Concorso di Programmazione Neumann János.",
    identity: {
      languages: [
        { name: 'Ungherese', level: 'Madrelingua', comment: null },
        { name: 'Tedesco', level: 'Intermedio superiore (B2)', comment: null },
        { name: 'Inglese', level: 'Intermedio superiore (B2)', comment: null },
      ],
    },
  },
};
