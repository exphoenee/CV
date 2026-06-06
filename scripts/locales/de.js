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
  },
  content: {
    summary:
      "Frontend-Ingenieur, spezialisiert auf Frontend-Architektur, Systemdesign und die Modernisierung großer Legacy-Systeme. Leitete vollständige Rewrites und Migrationen von Unternehmenssystemen auf moderne Stacks und verbesserte die Wartbarkeit und Skalierbarkeit der Kernplattformen. Führte KI-gestützte Entwicklungs-Workflows ein, die Liefergeschwindigkeit, Entwicklerkonsistenz und Release-Zuverlässigkeit deutlich steigerten. Starker Fokus auf evidenzbasiertes Refactoring, CI-Qualitätsstandards und den Aufbau nachhaltiger, systemweiter Frontend-Grundlagen.",

    workExperience: [
      {
        id: "aegex",
        description:
          "Leitete die architektonische Modernisierung zweier Legacy-Unternehmenssysteme. Übernahm die vollständige End-to-End-Verantwortung für SafeSy und FACTS, einschließlich Systemdesign, Frontend-Architektur und Backend-Integration. Führte KI-gestützte Entwicklungs-Workflows und CI-getriebene Qualitätspipelines ein, um einen evidenzbasierten Engineering-Prozess zu etablieren und Liefergeschwindigkeit sowie Release-Zuverlässigkeit erheblich zu steigern.",
        bullets: [
          "Übernahm Architektur und Lieferung zweier Unternehmenssysteme (SafeSy, FACTS) vom Design bis zur Produktion",
          "Leitete die Modernisierung von Legacy-Systemen durch vollständige Rewrites und Migration auf moderne Frontend-Stacks",
          "Führte KI-gestützte Entwicklungs-Workflows ein und steigerte Entwicklerdurchsatz und Konsistenz",
          "Implementierte CI-Pipeline mit automatisierten Quality Gates und Teststrategie von Grund auf",
          "Etablierte evidenzbasierten Refactoring-Prozess mit messbaren Qualitätsverbesserungen",
          "Mentoriert und leitet aktuell 1 Mid-Level-Ingenieur",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Internes Produktionsmanagementsystem",
            bullets: [
              "Entwickelte eine rollenübergreifende Unternehmensplattform für Produktion, Büro, Führungskräfte und Partner mit Echtzeit-Workflow- und Bestandsverfolgung",
              "Entwarf und implementierte eine wiederverwendbare interne Svelte-Komponentenbibliothek für die gesamte Plattform",
              "Entwickelte ein abonnierbares tägliches E-Mail-Reporting-System und trug zum Express-Backend bei (einschließlich SQL-Abfragedesign und -optimierung)",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Rohstoff- und Compliance-Tracking-System",
            bullets: [
              "Reduzierte den Release-Zyklus von monatlich auf zweiwöchentlich (Ziel: wöchentlich) durch KI-gestützte Entwicklungs-Workflows (Claude-basiertes Tooling)",
              "Führte CI-Pipeline mit automatisierten Quality Gates ein; etablierte Testabdeckung von null und reduzierte Produktionsprobleme deutlich",
              "Migrierte Architektur auf PNPM-Monorepo und extrahierte gemeinsames FACTS/Driver-Paket zur Wiederverwendung",
              "Entwickelte internes CLI-Tooling für Monorepo-Workflow-Automatisierung und Entwicklerproduktivität",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Arbeitete in einem agilen Unternehmensumfeld an einem KI-integrierten Frontend-System mit Fokus auf Echtzeit-Datenvisualisierung und Frontend-Backend-Integration. Entwickelte typsichere UI-Komponenten und trug zu KI-gesteuerten Test-Workflows und Analyse-Interfaces bei.",
        bullets: [
          "Entwickelte typsichere React-basierte UI-Komponenten für KI-integrierte Unternehmenssysteme",
          "Integrierte Frontend-Interfaces mit KI-gesteuerten Backend-Services über API-Workflows",
          "Entwickelte Echtzeit-Datenvisualisierungs-Interfaces für Testergebnisse und Systemanalyse",
          "Arbeitete in einem agilen Lieferumfeld mit kontinuierlicher Integration von Frontend- und Backend-Systemen",
        ],
      },
      {
        id: "scolia",
        description:
          "Als Frontend-Entwickler bei Scolia, einer Echtzeit-Automatik-Scorekeeping-Lösung für Steel-Tip-Darts:",
        bullets: [
          "Entwickelte responsive, dynamische UIs in Zusammenarbeit mit dem Design-Team.",
          "Erstellte interaktive Visualisierungen für Echtzeit-Fortschrittsverfolgung und Leistungsanalyse.",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Lieferte produktionsreife Frontend-Anwendungen für internationale Kunden in einem agilen Umfeld. Fokus auf skalierbarer UI-Architektur, Frontend-Standards und Verbesserung der Anforderungsklarheit zwischen Stakeholdern und Entwicklungsteams.",
        bullets: [
          "Entwickelte produktionsreife React und Next.js Frontend-Anwendungen für internationale Kunden",
          "Verbesserte die Konsistenz der Frontend-Architektur durch Definition und Durchsetzung von Code-Standards im Team",
          "Überarbeitete den Prozess zur Erfassung von Kundenanforderungen und reduzierte Mehrdeutigkeiten und Iterationszyklen",
          "Arbeitete mit Design- und Backend-Teams zusammen, um skalierbare, browserübergreifende UI-Systeme zu liefern",
        ],
      },
      {
        id: "cobotx",
        description:
          "Leitete Engineering-Projekte in industrieller Robotik und Automation, überbrückte Maschinenbau, PLC-Systeme und softwaregetriebene Automatisierung. Verantwortlich für Systemspezifikation, Teamführung und Lieferplanung in produktionskritischen Umgebungen.",
        bullets: [
          "Entwickelte Hardware- und Software-Spezifikationen für PLC-basierte Robotik- und Automationssysteme",
          "Definierte technische Anforderungen und Machbarkeitsstudien für industrielle Robotiklösungen",
          "Aufbau und Leitung eines 4-köpfigen Ingenieurteams mit Überwachung von Lieferung, Leistung und Projektausführung",
          "Etablierte KPIs, Dokumentationsstandards und Reporting-Prozesse für Engineering-Betrieb",
          "Erstellte Kapazitäts- und Finanzplanung abgestimmt auf Vertriebs- und Produktionsprognosen",
        ],
      },
      {
        id: "webforsol",
        description:
          "Lieferte Full-Stack-Webanwendungen als eigenständiger Entwickler für Kunden aus mehreren Branchen. Fokus auf Systemdesign, wartbarer Architektur und End-to-End-Lieferung skalierbarer Weblösungen.",
        bullets: [
          "Entwickelte Full-Stack-Anwendungen mit React, Next.js, Node.js, PHP und relationalen/nicht-relationalen Datenbanken",
          "Entwarf und implementierte REST APIs und modulare Backend-Architekturen für Kundensysteme",
          "Lieferte End-to-End-Produktentwicklung von der Anforderungsanalyse bis zu Deployment und Wartung",
          "Arbeitete direkt mit Kunden, um Geschäftsanforderungen in skalierbare technische Lösungen zu übersetzen",
          "Optimierte die Anwendungsstruktur für Wartbarkeit, Erweiterbarkeit und langfristige Skalierbarkeit",
        ],
      },
    ],

    community:
      'Startete und leitet einen Pro-bono-Nachmittagskurs für IT und Programmierung an der Mátyás Király Straße Grundschule in Pécs (Februar 2026, laufend). Entwarf den vollständigen Lehrplan. Unter seiner Betreuung gewann das Team den 1. Platz beim 2026er „Hack and Code"-Wettbewerb (Radnóti SZKI) und belegte Platz 1 und 3 beim 22. Neumann János Programmierwettbewerb.',

    identity: {
      languages: [
        { name: "Ungarisch", level: "Muttersprache", comment: null },
        { name: "Deutsch", level: "Obere Mittelstufe (B2)", comment: null },
        { name: "Englisch", level: "Obere Mittelstufe (B2)", comment: null },
      ],
    },
  },
};
