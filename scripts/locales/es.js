export const ES = {
  labels: {
    cvOf: "Currículum Vítae de",
    roleLocation: "Frontend Tech Lead · Pécs, HU",
    chooseView: "Elige cómo ver mi CV",
    btnReadingLabel: "Estoy leyendo el CV",
    btnReadingDesc: "CV limpio, legible e imprimible",
    btnFrontendLabel: "Soy desarrollador Frontend",
    btnFrontendDesc: "Documentación API estilo Swagger",
    btnBackendLabel: "Soy desarrollador Backend",
    btnBackendDesc: "Vista JSON / VS Code",
    btnGamerLabel: "Soy Gamer",
    btnGamerDesc: "Mundo RPG 2.5D interactivo",
    btnHireLabel: "Contrátame",
    btnHireDesc: "Envíame un mensaje",
    workExperience: "Experiencia laboral",
    education: "Formación",
    languages: "Idiomas",
    programmingLanguages: "Lenguajes de programación",
    hobbyProjects: "Proyectos personales",
    community: "Comunidad y Mentoría",
    references: "Referencia(s):",
    hireMe: "Contrátame",
    print: "🖸 Imprimir",
    poweredBy: "Desarrollado con",
    current: "actual",
    contactTitle: "Contactar a Viktor",
    yourName: "Tu nombre",
    namePlaceholder: "Juan García",
    yourEmail: "Tu correo",
    emailPlaceholder: "tu@email.es",
    message: "Mensaje",
    messagePlaceholder: "Hola Viktor, nos gustaría...",
    send: "Enviar",
    messageSent: "Mensaje enviado correctamente.",
    close: "Cerrar",
    themeChanged: "Tema:",
    musicChangedTo: "Música:",
    musicPaused: "pausado",
    musicPlaying: "reproduciendo",
    nowPlaying: "Reproduciendo:",
    repeatNone: "Sin repetición",
    repeatAll: "Repetir todo",
    repeatOne: "Repetir uno",
  },
  content: {
    summary:
      "Ingeniero Frontend especializado en arquitectura frontend, diseño de sistemas y modernización a gran escala de sistemas legacy. He liderado reescrituras completas y migraciones de sistemas empresariales a stacks modernos, mejorando la mantenibilidad y escalabilidad de las plataformas principales. He introducido flujos de trabajo de desarrollo asistidos por IA que aumentaron significativamente la velocidad de entrega, la consistencia técnica y la fiabilidad de los releases. Me enfoco fuertemente en el refactoring basado en evidencias, los estándares de calidad CI y la construcción de bases frontend sostenibles a nivel de sistema.",

    workExperience: [
      {
        id: "aegex",
        description:
          "Lideré la modernización arquitectónica de dos sistemas empresariales legacy. Tengo responsabilidad completa de extremo a extremo para SafeSy y FACTS, incluyendo diseño de sistemas, arquitectura frontend e integración backend. Introduje flujos de trabajo de desarrollo asistidos por IA y pipelines de calidad impulsados por CI, habilitando un proceso de ingeniería basado en evidencias y mejorando significativamente la velocidad de entrega y la fiabilidad de los releases.",
        bullets: [
          "Tomé posesión de la arquitectura y entrega de dos sistemas empresariales (SafeSy, FACTS) desde el diseño hasta producción",
          "Lideré la modernización de sistemas legacy mediante reescrituras completas y migración a stacks frontend modernos",
          "Introduje flujos de trabajo de desarrollo asistidos por IA mejorando el rendimiento y la consistencia del equipo",
          "Implementé un pipeline CI con quality gates automatizados y estrategia de pruebas desde cero",
          "Establecí un proceso de refactoring basado en evidencias con mejoras de calidad medibles",
          "Actualmente mentorizo y lidero a 1 ingeniero de nivel medio",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Sistema interno de gestión de producción",
            bullets: [
              "Construí una plataforma empresarial multi-rol para producción, oficina, ejecutivos y socios con seguimiento en tiempo real de flujos de trabajo e inventario",
              "Diseñé e implementé una biblioteca de componentes Svelte interna reutilizable en toda la plataforma",
              "Desarrollé un sistema de reportes diarios por correo suscribible y contribuí al backend Express (diseño y optimización de consultas SQL)",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Sistema de seguimiento de materias primas y cumplimiento",
            bullets: [
              "Reduje el ciclo de release de mensual a quincenal (objetivo: semanal) usando flujos de trabajo asistidos por IA (herramientas basadas en Claude)",
              "Introduje un pipeline CI con quality gates automatizados; establecí cobertura de pruebas desde cero y reduje significativamente los problemas en producción",
              "Migré la arquitectura a un monorepo PNPM y extraje un paquete FACTS/Driver compartido para su reutilización",
              "Construí herramientas CLI internas para la automatización de workflows del monorepo y la productividad del desarrollador",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Trabajé en un entorno Agile empresarial en un sistema frontend integrado con IA, enfocado en visualización de datos en tiempo real e integración frontend-backend. Construí componentes UI type-safe y contribuí a flujos de trabajo de pruebas impulsados por IA e interfaces de análisis.",
        bullets: [
          "Desarrollé componentes UI basados en React type-safe para sistemas empresariales integrados con IA",
          "Integré interfaces frontend con servicios backend impulsados por IA mediante flujos de trabajo API",
          "Construí interfaces de visualización de datos en tiempo real para resultados de pruebas y análisis de sistemas",
          "Trabajé en un entorno de entrega Agile con integración continua de sistemas frontend y backend",
        ],
      },
      {
        id: "scolia",
        description:
          "Como desarrollador Frontend en Scolia, trabajé en una solución de puntuación automática en tiempo real para dardos de punta de acero:",
        bullets: [
          "Construí interfaces de usuario responsivas y dinámicas en colaboración con el equipo de diseño.",
          "Creé visualizaciones interactivas para el seguimiento del progreso en tiempo real y el análisis de rendimiento.",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Entregué aplicaciones frontend de calidad de producción para clientes internacionales en un entorno Agile. Me enfoqué en arquitectura UI escalable, estándares frontend y mejora de la claridad de requisitos entre partes interesadas y equipos de desarrollo.",
        bullets: [
          "Construí aplicaciones frontend React y Next.js listas para producción para clientes internacionales",
          "Mejoré la consistencia de la arquitectura frontend definiendo y aplicando estándares de código en el equipo",
          "Rediseñé el proceso de captura de requisitos de clientes, reduciendo la ambigüedad y los ciclos de iteración",
          "Colaboré con equipos de diseño y backend para entregar sistemas UI escalables y compatibles con múltiples navegadores",
        ],
      },
      {
        id: "cobotx",
        description:
          "Lideré proyectos de ingeniería en robótica industrial y automatización, conectando ingeniería mecánica, sistemas PLC y automatización impulsada por software. Fui responsable de la especificación de sistemas, liderazgo de equipo y planificación de entrega en entornos críticos para la producción.",
        bullets: [
          "Desarrollé especificaciones de hardware y software para sistemas de robótica y automatización basados en PLC",
          "Definí requisitos técnicos y estudios de viabilidad para soluciones de robótica industrial",
          "Construí y lideré un equipo de 4 ingenieros, supervisando la entrega, el rendimiento y la ejecución de proyectos",
          "Establecí KPIs, estándares de documentación y procesos de reporte para las operaciones de ingeniería",
          "Creé planes de capacidad y financieros alineados con las previsiones de ventas y producción",
        ],
      },
      {
        id: "webforsol",
        description:
          "Entregué aplicaciones web full-stack como desarrollador independiente para clientes de múltiples sectores. Me enfoqué en diseño de sistemas, arquitectura mantenible y entrega de extremo a extremo de soluciones web escalables.",
        bullets: [
          "Construí aplicaciones full-stack con React, Next.js, Node.js, PHP y bases de datos relacionales/no relacionales",
          "Diseñé e implementé APIs REST y arquitecturas backend modulares para sistemas de clientes",
          "Entregué desarrollo de producto de extremo a extremo desde el análisis de requisitos hasta el despliegue y mantenimiento",
          "Trabajé directamente con clientes para traducir necesidades de negocio en soluciones técnicas escalables",
          "Optimicé la estructura de aplicaciones para mantenibilidad, extensibilidad y escalabilidad a largo plazo",
        ],
      },
    ],

    community:
      'Puse en marcha y dirijo un club extraescolar de informática y programación gratuito y voluntario en la Escuela Primaria de la Calle Mátyás Király en Pécs (febrero 2026, en curso). Diseñé el currículum completo. Bajo mi mentoría, el equipo ganó el 1er lugar en el concurso "Hack and Code" 2026 (Radnóti SZKI) y quedó 1° y 3° en el 22° Concurso de Programación Neumann János.',

    identity: {
      languages: [
        { name: "Húngaro", level: "Lengua materna", comment: null },
        { name: "Alemán", level: "Intermedio alto (B2)", comment: null },
        { name: "Inglés", level: "Intermedio alto (B2)", comment: null },
      ],
    },
  },
};
