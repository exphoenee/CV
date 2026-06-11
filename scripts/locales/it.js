export const IT = {
  labels: {
    cvOf: "Curriculum Vitae di",
    roleLocation: "Frontend Tech Lead · Pécs, HU",
    chooseView: "Scegli come visualizzare il mio CV",
    btnReadingLabel: "Sto leggendo il CV",
    btnReadingDesc: "CV pulito, leggibile e stampabile",
    btnFrontendLabel: "Sono uno sviluppatore Frontend",
    btnFrontendDesc: "Documentazione API in stile Swagger",
    btnBackendLabel: "Sono uno sviluppatore Backend",
    btnBackendDesc: "Vista JSON / VS Code",
    btnGamerLabel: "Sono un Gamer",
    btnGamerDesc: "Mondo RPG 2.5D interattivo",
    btnHireLabel: "Assumimi",
    btnHireDesc: "Inviami un messaggio",
    workExperience: "Esperienza lavorativa",
    education: "Istruzione",
    languages: "Lingue",
    programmingLanguages: "Linguaggi di programmazione",
    hobbyProjects: "Progetti personali",
    community: "Comunità e Mentorship",
    references: "Riferimento/i:",
    hireMe: "Assumimi",
    print: "Stampa",
    poweredBy: "Realizzato con",
    current: "attuale",
    contactTitle: "Contatta Viktor",
    yourName: "Il tuo nome",
    namePlaceholder: "Mario Rossi",
    yourEmail: "La tua email",
    emailPlaceholder: "tua@email.it",
    message: "Messaggio",
    messagePlaceholder: "Ciao Viktor, vorremmo...",
    send: "Invia",
    messageSent: "Messaggio inviato con successo.",
    close: "Chiudi",
    themeChanged: "Tema:",
    musicChangedTo: "Musica:",
    musicPaused: "in pausa",
    musicPlaying: "in riproduzione",
    nowPlaying: "In riproduzione:",
    repeatNone: "Nessuna ripetizione",
    repeatAll: "Ripeti tutto",
    repeatOne: "Ripeti uno",
    bookMeeting: "Prenota un incontro",
    bookMeetingDesc: "Pianifica una chiamata con me",
    bookTitle: "Prenota un incontro",
    bookStep1: "1 / 3 — Scegli un giorno",
    bookStep2: "2 / 3 — Scegli un orario",
    bookStep3: "3 / 3 — I tuoi dati",
    bookBack: "Indietro",
    bookSlot: "slot libero",
    bookSlots: "slot liberi",
    bookYourName: "Il tuo nome",
    bookYourEmail: "Indirizzo email",
    bookTopic: "Argomento / Nota",
    bookTopicPlaceholder: "es. Consulenza, Riunione…",
    bookSubmit: "Prenota",
    bookSending: "Invio in corso…",
    bookConfirmTitle: "Prenotazione confermata!",
    bookConfirmNote: "Una conferma è stata inviata alla tua email.",
    bookNewBooking: "Nuova prenotazione",
    bookLoading: "Caricamento degli slot disponibili…",
    bookError: "Impossibile caricare gli slot.",
    bookRetry: "Riprova",
    bookEmpty: "Nessuno slot disponibile nei prossimi 21 giorni.",
    bookFailed: "Prenotazione fallita. Riprova.",
  },
  content: {
    summary:
      "Ingegnere Frontend specializzato in architettura frontend, progettazione di sistemi e modernizzazione su larga scala di sistemi legacy. Ho guidato riscritture complete e migrazioni di sistemi aziendali verso stack moderni, migliorando la manutenibilità e la scalabilità delle piattaforme principali. Ho introdotto flussi di lavoro di sviluppo assistiti dall'IA che hanno aumentato significativamente la velocità di consegna, la coerenza tecnica e l'affidabilità dei release. Mi concentro fortemente sul refactoring basato su evidenze, sugli standard di qualità CI e sulla costruzione di fondamenta frontend sostenibili a livello di sistema.",

    workExperience: [
      {
        id: "aegex",
        description:
          "Ho guidato la modernizzazione architetturale di SafeSy e FACTS con piena responsabilità end-to-end: progettazione del sistema, architettura frontend e integrazione backend. Workflow assistiti dall'IA e pipeline CI hanno migliorato significativamente velocità di consegna e affidabilità dei release.",
        bullets: [
          "Ho preso in carico architettura e consegna di due sistemi aziendali (SafeSy, FACTS) dal design alla produzione",
          "Ho guidato la modernizzazione di sistemi legacy tramite riscritture complete e migrazione verso stack frontend moderni",
          "Ho introdotto flussi di lavoro di sviluppo assistiti dall'IA migliorando la produttività e la coerenza del team",
          "Ho implementato un pipeline CI con quality gate automatizzati e strategia di test da zero",
          "Ho stabilito un processo di refactoring basato su evidenze con miglioramenti della qualità misurabili",
          "Sto attualmente mentorando e guidando 1 ingegnere di livello intermedio",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Sistema interno di gestione della produzione",
            bullets: [
              "Piattaforma aziendale multi-ruolo (produzione, ufficio, dirigenti, partner) con tracciamento in tempo reale di workflow e inventario",
              "Libreria di componenti Svelte interna riutilizzabile progettata e implementata per tutta la piattaforma",
              "Sistema di reportistica giornaliera via email sviluppato; contribuito al backend Express (progettazione e ottimizzazione query SQL)",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Sistema di tracciamento materie prime e conformità",
            bullets: [
              "Ciclo di release ridotto da mensile a bisettimanale (obiettivo: settimanale) con workflow assistiti dall'IA (tooling Claude)",
              "Pipeline CI con quality gate automatizzati introdotta; copertura dei test stabilita da zero, problemi in produzione ridotti significativamente",
              "Architettura migrata verso monorepo PNPM, pacchetto condiviso FACTS/Driver estratto",
              "Tooling CLI interno sviluppato per automazione workflow monorepo e produttività degli sviluppatori",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Ho lavorato in un ambiente Agile aziendale su un sistema frontend integrato con l'IA, focalizzato sulla visualizzazione di dati in tempo reale e l'integrazione frontend-backend. Ho costruito componenti UI type-safe e contribuito ai workflow di test guidati dall'IA e alle interfacce di analisi.",
        bullets: [
          "Ho sviluppato componenti UI React type-safe per sistemi aziendali integrati con l'IA",
          "Ho integrato interfacce frontend con servizi backend guidati dall'IA tramite workflow API",
          "Ho costruito interfacce di visualizzazione dati in tempo reale per risultati di test e analisi di sistema",
          "Ho lavorato in un ambiente di consegna Agile con integrazione continua di sistemi frontend e backend",
        ],
      },
      {
        id: "scolia",
        description:
          "Come sviluppatore Frontend in Scolia, ho lavorato su una soluzione di punteggio automatico in tempo reale per freccette a punta d'acciaio:",
        bullets: [
          "Ho costruito interfacce utente responsive e dinamiche in collaborazione con il team di design.",
          "Ho creato visualizzazioni interattive per il tracciamento del progresso in tempo reale e l'analisi delle prestazioni.",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Ho consegnato applicazioni frontend di qualità produzione per clienti internazionali in un ambiente Agile. Mi sono concentrato su architettura UI scalabile, standard frontend e miglioramento della chiarezza dei requisiti tra stakeholder e team di sviluppo.",
        bullets: [
          "Ho costruito applicazioni frontend React e Next.js pronte per la produzione per clienti internazionali",
          "Ho migliorato la coerenza dell'architettura frontend definendo e applicando standard di codice nel team",
          "Ho riprogettato il processo di raccolta dei requisiti dei clienti, riducendo l'ambiguità e i cicli di iterazione",
          "Ho collaborato con team di design e backend per consegnare sistemi UI scalabili e compatibili con più browser",
        ],
      },
      {
        id: "cobotx",
        description:
          "Ho guidato progetti di ingegneria in robotica industriale e automazione, collegando ingegneria meccanica, sistemi PLC e automazione guidata da software. Ero responsabile della specifica dei sistemi, della guida del team e della pianificazione delle consegne in ambienti critici per la produzione.",
        bullets: [
          "Ho sviluppato specifiche hardware e software per sistemi di robotica e automazione basati su PLC",
          "Ho definito requisiti tecnici e condotto studi di fattibilità per soluzioni di robotica industriale",
          "Ho costituito e guidato un team di 4 ingegneri, supervisionando consegna, performance ed esecuzione dei progetti",
          "Ho stabilito KPI, standard di documentazione e processi di reportistica per le operazioni di ingegneria",
          "Ho creato piani di capacità e finanziari allineati alle previsioni di vendita e produzione",
        ],
      },
      {
        id: "webforsol",
        description:
          "Ho consegnato applicazioni web full-stack come sviluppatore indipendente per clienti di più settori. Mi sono concentrato su progettazione di sistemi, architettura manutenibile e consegna end-to-end di soluzioni web scalabili.",
        bullets: [
          "Ho costruito applicazioni full-stack con React, Next.js, Node.js, PHP e database relazionali/non relazionali",
          "Ho progettato e implementato API REST e architetture backend modulari per sistemi clienti",
          "Ho consegnato sviluppo prodotto end-to-end dall'analisi dei requisiti al deployment e alla manutenzione",
          "Ho lavorato direttamente con i clienti per tradurre esigenze aziendali in soluzioni tecniche scalabili",
          "Ho ottimizzato la struttura delle applicazioni per manutenibilità, estensibilità e scalabilità a lungo termine",
        ],
      },
    ],

    community:
      "Ho avviato e attualmente guido un club scolastico gratuito di informatica e programmazione come volontario presso la Scuola Primaria di Via Mátyás Király a Pécs (febbraio 2026, in corso). Ho progettato l'intero programma didattico. Sotto la mia mentorship, il team ha vinto il 1° posto al concorso «Hack and Code» 2026 (Radnóti SZKI) e si è classificato 1° e 3° al 22° Concorso di Programmazione Neumann János.",

    identity: {
      languages: [
        {name: "Ungherese", level: "Madrelingua", comment: null},
        {name: "Tedesco", level: "Intermedio superiore (B2)", comment: null},
        {name: "Inglese", level: "Intermedio superiore (B2)", comment: null},
      ],
    },
  },
};
