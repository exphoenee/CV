export const DE = {
  labels: {
    cvOf: "Lebenslauf von",
    roleLocation: "Frontend Tech Lead · Pécs, HU",
    chooseView: "Wähle, wie du meinen Lebenslauf ansehen möchtest",
    btnReadingLabel: "Ich lese den Lebenslauf",
    btnReadingDesc: "Sauber, lesbar, druckbarer Lebenslauf",
    btnFrontendLabel: "Ich bin Frontend-Entwickler",
    btnFrontendDesc: "Swagger-style API-Dokumentation",
    btnBackendLabel: "Ich bin Backend-Entwickler",
    btnBackendDesc: "JSON / VS Code Ansicht",
    btnGamerLabel: "Ich bin Gamer",
    btnGamerDesc: "Interaktive 2.5D RPG-Welt",
    btnHireLabel: "Stell mich ein!",
    btnHireDesc: "Schick mir eine Nachricht",
    workExperience: "Berufserfahrung",
    education: "Ausbildung",
    languages: "Sprachen",
    programmingLanguages: "Programmiersprachen",
    hobbyProjects: "Hobbyprojekte",
    community: "Gemeinschaft & Mentoring",
    references: "Referenz(en):",
    hireMe: "Stell mich ein!",
    print: "🖸 Drucken",
    poweredBy: "Erstellt mit",
    current: "aktuell",
    contactTitle: "Kontakt",
    yourName: "Ihr Name",
    namePlaceholder: "Max Mustermann",
    yourEmail: "Ihre E-Mail",
    emailPlaceholder: "ihre@email.de",
    message: "Nachricht",
    messagePlaceholder: "Hallo Viktor, wir würden gerne...",
    send: "Senden",
    messageSent: "Nachricht erfolgreich gesendet.",
    close: "Schließen",
    themeChanged: "Thema gewechselt:",
    musicChangedTo: "Musik gewechselt:",
    musicPaused: "pausiert",
    musicPlaying: "spielt",
    nowPlaying: "Jetzt läuft:",
    repeatNone: "Keine Wiederholung",
    repeatAll: "Alle wiederholen",
    repeatOne: "Eine wiederholen",
  },
  content: {
    summary:
      "Frontend-Ingenieur, spezialisiert auf Frontend-Architektur, Systemdesign und die Modernisierung großer Legacy-Systeme. Ich habe vollständige Rewrites und Migrationen von Unternehmenssystemen auf moderne Stacks geleitet und die Wartbarkeit und Skalierbarkeit der Kernplattformen verbessert. Ich habe KI-gestützte Entwicklungs-Workflows eingeführt, die Liefergeschwindigkeit, Entwicklerkonsistenz und Release-Zuverlässigkeit deutlich steigerten. Ich lege starken Fokus auf evidenzbasiertes Refactoring, CI-Qualitätsstandards und den Aufbau nachhaltiger, systemweiter Frontend-Grundlagen.",

    workExperience: [
      {
        id: "aegex",
        description:
          "Ich leitete die architektonische Modernisierung zweier Legacy-Unternehmenssysteme. Ich übernahm die vollständige End-to-End-Verantwortung für SafeSy und FACTS, einschließlich Systemdesign, Frontend-Architektur und Backend-Integration. Ich führte KI-gestützte Entwicklungs-Workflows und CI-getriebene Qualitätspipelines ein, um einen evidenzbasierten Engineering-Prozess zu etablieren und Liefergeschwindigkeit sowie Release-Zuverlässigkeit erheblich zu steigern.",
        bullets: [
          "Ich übernahm Architektur und Lieferung zweier Unternehmenssysteme (SafeSy, FACTS) vom Design bis zur Produktion",
          "Ich leitete die Modernisierung von Legacy-Systemen durch vollständige Rewrites und Migration auf moderne Frontend-Stacks",
          "Ich führte KI-gestützte Entwicklungs-Workflows ein und steigerte Entwicklerdurchsatz und Konsistenz",
          "Ich implementierte eine CI-Pipeline mit automatisierten Quality Gates und Teststrategie von Grund auf",
          "Ich etablierte einen evidenzbasierten Refactoring-Prozess mit messbaren Qualitätsverbesserungen",
          "Ich mentoriere und leite aktuell 1 Mid-Level-Ingenieur",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Internes Produktionsmanagementsystem",
            bullets: [
              "Ich entwickelte eine rollenübergreifende Unternehmensplattform für Produktion, Büro, Führungskräfte und Partner mit Echtzeit-Workflow- und Bestandsverfolgung",
              "Ich entwarf und implementierte eine wiederverwendbare interne Svelte-Komponentenbibliothek für die gesamte Plattform",
              "Ich entwickelte ein abonnierbares tägliches E-Mail-Reporting-System und trug zum Express-Backend bei (einschließlich SQL-Abfragedesign und -optimierung)",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Rohstoff- und Compliance-Tracking-System",
            bullets: [
              "Ich reduzierte den Release-Zyklus von monatlich auf zweiwöchentlich (Ziel: wöchentlich) durch KI-gestützte Entwicklungs-Workflows (Claude-basiertes Tooling)",
              "Ich führte eine CI-Pipeline mit automatisierten Quality Gates ein; etablierte Testabdeckung von null und reduzierte Produktionsprobleme deutlich",
              "Ich migrierte die Architektur auf PNPM-Monorepo und extrahierte das gemeinsame FACTS/Driver-Paket zur Wiederverwendung",
              "Ich entwickelte internes CLI-Tooling für Monorepo-Workflow-Automatisierung und Entwicklerproduktivität",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Ich arbeitete in einem agilen Unternehmensumfeld an einem KI-integrierten Frontend-System mit Fokus auf Echtzeit-Datenvisualisierung und Frontend-Backend-Integration. Ich entwickelte typsichere UI-Komponenten und trug zu KI-gesteuerten Test-Workflows und Analyse-Interfaces bei.",
        bullets: [
          "Ich entwickelte typsichere React-basierte UI-Komponenten für KI-integrierte Unternehmenssysteme",
          "Ich integrierte Frontend-Interfaces mit KI-gesteuerten Backend-Services über API-Workflows",
          "Ich entwickelte Echtzeit-Datenvisualisierungs-Interfaces für Testergebnisse und Systemanalyse",
          "Ich arbeitete in einem agilen Lieferumfeld mit kontinuierlicher Integration von Frontend- und Backend-Systemen",
        ],
      },
      {
        id: "scolia",
        description:
          "Als Frontend-Entwickler bei Scolia arbeitete ich an einer Echtzeit-Automatik-Scorekeeping-Lösung für Steel-Tip-Darts:",
        bullets: [
          "Ich entwickelte responsive, dynamische UIs in Zusammenarbeit mit dem Design-Team.",
          "Ich erstellte interaktive Visualisierungen für Echtzeit-Fortschrittsverfolgung und Leistungsanalyse.",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Ich lieferte produktionsreife Frontend-Anwendungen für internationale Kunden in einem agilen Umfeld. Ich fokussierte mich auf skalierbare UI-Architektur, Frontend-Standards und die Verbesserung der Anforderungsklarheit zwischen Stakeholdern und Entwicklungsteams.",
        bullets: [
          "Ich entwickelte produktionsreife React und Next.js Frontend-Anwendungen für internationale Kunden",
          "Ich verbesserte die Konsistenz der Frontend-Architektur durch Definition und Durchsetzung von Code-Standards im Team",
          "Ich überarbeitete den Prozess zur Erfassung von Kundenanforderungen und reduzierte Mehrdeutigkeiten und Iterationszyklen",
          "Ich arbeitete mit Design- und Backend-Teams zusammen, um skalierbare, browserübergreifende UI-Systeme zu liefern",
        ],
      },
      {
        id: "cobotx",
        description:
          "Ich leitete Engineering-Projekte in industrieller Robotik und Automation und überbrückte Maschinenbau, PLC-Systeme und softwaregetriebene Automatisierung. Ich war verantwortlich für Systemspezifikation, Teamführung und Lieferplanung in produktionskritischen Umgebungen.",
        bullets: [
          "Ich entwickelte Hardware- und Software-Spezifikationen für PLC-basierte Robotik- und Automationssysteme",
          "Ich definierte technische Anforderungen und Machbarkeitsstudien für industrielle Robotiklösungen",
          "Ich baute und leitete ein 4-köpfiges Ingenieurteam und überwachte Lieferung, Leistung und Projektausführung",
          "Ich etablierte KPIs, Dokumentationsstandards und Reporting-Prozesse für den Engineering-Betrieb",
          "Ich erstellte Kapazitäts- und Finanzplanung abgestimmt auf Vertriebs- und Produktionsprognosen",
        ],
      },
      {
        id: "webforsol",
        description:
          "Ich lieferte Full-Stack-Webanwendungen als eigenständiger Entwickler für Kunden aus mehreren Branchen. Ich fokussierte mich auf Systemdesign, wartbare Architektur und End-to-End-Lieferung skalierbarer Weblösungen.",
        bullets: [
          "Ich entwickelte Full-Stack-Anwendungen mit React, Next.js, Node.js, PHP und relationalen/nicht-relationalen Datenbanken",
          "Ich entwarf und implementierte REST APIs und modulare Backend-Architekturen für Kundensysteme",
          "Ich lieferte End-to-End-Produktentwicklung von der Anforderungsanalyse bis zu Deployment und Wartung",
          "Ich arbeitete direkt mit Kunden, um Geschäftsanforderungen in skalierbare technische Lösungen zu übersetzen",
          "Ich optimierte die Anwendungsstruktur für Wartbarkeit, Erweiterbarkeit und langfristige Skalierbarkeit",
        ],
      },
    ],

    community:
      'Ich startete und leite einen Pro-bono-Nachmittagskurs für IT und Programmierung an der Mátyás Király Straße Grundschule in Pécs (Februar 2026, laufend). Ich entwarf den vollständigen Lehrplan. Unter meiner Betreuung gewann das Team den 1. Platz beim 2026er „Hack and Code"-Wettbewerb (Radnóti SZKI) und belegte Platz 1 und 3 beim 22. Neumann János Programmierwettbewerb.',

    identity: {
      languages: [
        { name: "Ungarisch", level: "Muttersprache", comment: null },
        { name: "Deutsch", level: "Obere Mittelstufe (B2)", comment: null },
        { name: "Englisch", level: "Obere Mittelstufe (B2)", comment: null },
      ],
    },
  },
};
