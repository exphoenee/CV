/**
 * cv-data.js
 * Central CV data object — single source of truth for all CV views.
 * Load before any view-specific script.
 */
export const CV_DATA = {
  meta: {
    name: "Viktor Bozzay",
    role: "Frontend Tech Lead",
    version: "4.2.0",
    accentColor: "#ff7024",
    description: "Curriculum Vitae"
  },
  identity: {
    name: "Viktor Bozzay",
    role: "Developer",
    location: "Pécs, Hungary",
    contacts: [
      { label: "Pecs, Hungary", url: null },
      { label: "linkedin.com/in/viktorbozzay", url: "https://linkedin.com/in/viktorbozzay/" },
      { label: "github.com/exphoenee", url: "https://github.com/exphoenee" },
      { label: "bozzayviktor.hu", url: "https://www.bozzayviktor.hu" },
      { label: "bozzay.viktor@gmail.com", url: "mailto:bozzay.viktor@gmail.com" },
      { label: "+36306106608", url: null }
    ],
    languages: [
      { name: "Hungarian", level: "Native", comment: null },
      { name: "German", level: "Upper Intermediate (B2)", comment: null },
      { name: "English", level: "Upper Intermediate (B2)", comment: null }
    ]
  },
  summary: "Frontend developer who operates at the architecture level, not just building features, but evaluating whether the foundation they sit on is worth keeping. I have led full rewrites of legacy systems, migrated codebases to modern stacks, and designed AI-assisted development workflows that measurably accelerate delivery. I refactor and rewrite deliberately: only when the evidence justifies it, and always with a clear plan. My engineering background means I think in systems, not just components.",
  workExperience: [
    {
      id: "aegex",
      company: "Aegex Technologies",
      logo: "aegex.png",
      title: "Frontend Tech Lead",
      period: { from: "2023-11", to: null },
      periodLabel: "Nov 2023 - Present",
      isCurrent: true,
      teamSize: 2,
      description: "Assessed two legacy systems and drove the architectural decisions for modernizing each. Took full ownership of both SafeSy and FACTS from design through delivery, currently leading one mid-level colleague. Introduced AI-assisted workflows and a CI pipeline with automated quality checks; refactoring is ongoing and evidence-driven.",
      projects: [
        {
          name: "SafeSy",
          subtitle: "Internal manufacturing management system",
          bullets: [
            "Cross-role platform (production, office, executives, partners) managing workflows, inventory, and real-time data tracking",
            "Designed and built the internal Aegex Svelte component library used across the platform",
            "Built a subscribable daily email report system; contributed to the Express backend including SQL query development"
          ]
        },
        {
          name: "FACTS",
          subtitle: "Feedstock and Compliance Tracking System",
          bullets: [
            "Release cycle cut from monthly to 2 weeks (targeting 1 week) using a Claude AI-assisted workflow and custom framework tooling",
            "CI pipeline with automated quality checks introduced; test coverage built from zero, quality issues near eliminated",
            "Migrated to a monorepo, extracted shared FACTS/Driver code into a private package, and built a CLI tool for monorepo workflow management"
          ]
        }
      ],
      skills: ["Svelte", "React", "ExpressJS", "TypeScript", "Node.js", "Python", "SCSS", "Vite", "PNPM", "MySQL", "Jest", "Vitest", "Playwright", "Claude", "Codex"],
      refs: [
        { url: "https://facts.aegex.com", label: "facts.aegex.com" },
        { url: "https://driver.aegex.com", label: "driver.aegex.com" }
      ],
      hasDecor: true,
      game: {
        x: 420,
        y: 340,
        tech: "Svelte · React · TypeScript · Node.js · Express · MySQL · Vitest · Claude AI",
        description: "Aegex Technologies (Current)",
        highlights: [
          "SafeSy: Designed and built the internal Aegex Svelte component library used across all applications.",
          "SafeSy: Manages real-time workflows, inventory, and tracking across all user roles.",
          "SafeSy: Built a subscribable daily email report system; contributed to Express backend including SQL query optimization.",
          "FACTS: CI pipeline with automated quality checks introduced from scratch.",
          "FACTS: Migrated codebases to a robust PNPM monorepo, extracting shared driver packages.",
          "FACTS: Claude AI-assisted dev workflows cut release cycle from 30 days down to 14 days (targeting 7)."
        ]
      }
    },
    {
      id: "telekom",
      company: "Deutsche Telekom IT Solutions HU",
      logo: "telekom.png",
      title: "Developer",
      period: { from: "2023-07", to: "2023-11" },
      periodLabel: "Jul 2023 - Nov 2023",
      isCurrent: false,
      description: "Worked in an Agile environment with continuous API integration between frontend and AI backend",
      bullets: [
        "Built type-safe UI components and integrated the AI-driven backend with real-time analysis display",
        "Created intuitive interfaces for managing and viewing test results"
      ],
      skills: ["React", "Node.js", "NPM", "Jest", "Styled Components", "React Redux", "Webpack"],
      refs: [
        { url: "https://mobiledevice.cloud/order/ai4test", label: "mobiledevice.cloud/order/ai4test" }
      ],
      hasDecor: false,
      game: {
        x: 180,
        y: 340,
        tech: "React · TypeScript · Redux · Webpack · Agile",
        description: "Deutsche Telekom IT Solutions",
        highlights: [
          "Fast-paced, enterprise Agile environment with continuous frontend-AI backend integration.",
          "Built type-safe UI components integrated with AI-driven testing systems.",
          "Created intuitive dashboards for managing and viewing automated cloud test suites."
        ]
      }
    },
    {
      id: "scolia",
      company: "Scolia Technologies Ltd.",
      logo: "scolia.png",
      title: "Frontend Developer",
      period: { from: "2023-01", to: "2023-07" },
      periodLabel: "Jan 2023 - Jul 2023",
      isCurrent: false,
      description: "As a frontend developer for Scolia, a real-time automatic scorekeeping solution for steel-tip darts:",
      bullets: [
        "Built responsive, dynamic UIs in collaboration with the design team.",
        "Created interactive visualizations for real-time progress tracking and performance insights."
      ],
      skills: ["React", "Redux Saga", "Jest", "MongoDB", "SCSS", "CSS", "HTML", "Webpack", "WebSocket"],
      refs: [
        { url: "https://scoliadarts.com", label: "scoliadarts.com" }
      ],
      hasDecor: true,
      game: {
        x: 1140,
        y: 100,
        tech: "React · Redux Saga · WebSocket · MongoDB · Webpack",
        description: "Scolia Technologies",
        highlights: [
          "Built responsive, dynamic UIs where milliseconds matter and the UI has to keep up with flying darts.",
          "Created interactive canvas-based visualizations for real-time progress tracking.",
          "Integrated low-latency WebSocket live score feeds."
        ]
      }
    },
    {
      id: "cubicfox",
      company: "Cubicfox",
      logo: "cubicfox.png",
      title: "Frontend Developer",
      period: { from: "2022-09", to: "2023-01" },
      periodLabel: "Sep 2022 - Jan 2023",
      isCurrent: false,
      description: "Contributed to establishing the team's code conventions and standards, improving consistency across the codebase. Redesigned the process for gathering and analysing client requirements, leading to clearer specs and fewer revision cycles.",
      bullets: {
        hardSkills: [
          "Responsive, cross-browser UI development",
          "Git workflows and Agile methodologies"
        ],
        softSkills: [
          "Strong communication, collaboration, and attention to detail",
          "Effective at gathering client requirements and adapting to change"
        ]
      },
      skills: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "SCSS", "NPM", "Jest", "Webpack", "Next.js", "Styled Components"],
      refs: [
        { url: "https://www.fundmypitch.com", label: "fundmypitch.com" }
      ],
      hasDecor: true,
      game: {
        x: 900,
        y: 100,
        tech: "React · Next.js · TypeScript · SCSS · Jest · Webpack",
        description: "Cubicfox Technologies",
        highlights: [
          "Contributed to establishing the team's strict frontend code conventions and standards.",
          "Responsive, cross-browser UI development with strict pixel-perfect quality standards.",
          "Redesigned client requirements gathering—resulted in clearer specs and fewer revision cycles."
        ]
      }
    },
    {
      id: "cobotx",
      company: "CobotX Technologies",
      logo: "cobotx.png",
      title: "Technical Project Manager",
      period: { from: "2021-08", to: "2022-08" },
      periodLabel: "Aug 2021 - Aug 2022",
      isCurrent: false,
      description: "During my tenure at CobotX, I had the privilege of serving as an Engineering Manager, where I successfully built and led a team of 4 engineers.",
      bullets: {
        responsibilities: [
          "Developed hardware/software specifications for PLC and robotics systems",
          "Created capacity and financial plans aligned with the Sales Forecast"
        ],
        leadership: [
          "Built and led a team of 4 engineers, managing performance and project progress",
          "Set KPIs, improved documentation standards, and reported quarterly to management"
        ]
      },
      skills: ["Robot Applications", "Industrial Automation", "Project Management", "Universal Robot", "OnRobot", "OnShape", "Python", "PyCharm", "Machine Vision", "Mechanical Engineering"],
      refs: [],
      hasDecor: false,
      game: {
        x: 660,
        y: 100,
        tech: "Universal Robots · PLC · Machine Vision · Python",
        description: "CobotX Technologies",
        highlights: [
          "Engineering Manager at a high-tech robotics integrator, bridging mechanical engineering with modern software delivery.",
          "Literal robots. Universal Robots. Not metaphorical ones!",
          "Developed hardware/software specifications for PLC and robotics automation.",
          "Created capacity and financial plans aligned with sales forecasts.",
          "Set team KPIs, optimized documentation standards, and reported directly to board."
        ]
      }
    },
    {
      id: "webforsol",
      company: "WebforSol",
      logo: "websol.png",
      title: "Freelancer Full stack developer",
      period: { from: "2020-06", to: "2022-11" },
      periodLabel: "Jun 2020 - Nov 2022",
      isCurrent: false,
      description: "Operated as a freelance full-stack developer, delivering custom web solutions for clients across various industries. Focused on clean architecture, cost efficiency, and building systems that are easy to extend and maintain.",
      bullets: {
        hardSkills: [
          "Full-stack experience with React, Next.js, Node.js, MongoDB, MySQL, and PHP/Laravel"
        ],
        softSkills: [
          "Agile methodology practitioner with strong collaboration and adaptability",
          "Effective communication for understanding and meeting evolving client needs"
        ]
      },
      skills: ["React", "JavaScript", "jQuery", "Node.js", "PHP", "MySQL", "CSS", "Styled Components", "Next.js", "NestJS", "Project Management"],
      refs: [
        { url: "https://szelacoaching.hu", label: "szelacoaching.hu" },
        { url: "https://www.pecscoach.hu", label: "pecscoach.hu" },
        { url: "https://smartedu.hu", label: "smartedu.hu" }
      ],
      hasDecor: true,
      game: {
        x: 420,
        y: 100,
        tech: "React · Next.js · NestJS · PHP · Laravel · MySQL · MongoDB",
        description: "WebforSol (Freelance)",
        highlights: [
          "Delivered bespoke full-stack custom applications, matching high availability requirements.",
          "Designed and integrated clean database migrations and modular REST APIs.",
          "Delivered custom solutions for clients using Svelte, React, Node.js, and PHP."
        ]
      }
    }
  ],
  education: {
    institution: "Faculty of Engineering and Information Technology - University of Pécs",
    degrees: [
      { title: "Bachelor's degree, Quality Manager", years: "2003 - 2007" },
      { title: "Bachelor's degree, Machinery Technical Teacher Education", years: "2001 - 2004" },
      { title: "Bachelor of Engineering (BEng), Mechanical Engineering", years: "2000 - 2004" }
    ]
  },
  skillGroups: {
    primary:  { list: ["TypeScript", "JavaScript", "Svelte", "React", "Node.js", "SCSS", "HTML", "CSS"], comment: null },
    backend:  { list: ["Express.js", "NestJS", "Python", "PHP", "MySQL", "MongoDB"], comment: null },
    testing:  { list: ["Jest", "Vitest", "Playwright"], comment: "yes, all three" },
    tooling:  { list: ["Vite", "Webpack", "PNPM", "Next.js"], comment: null },
    ai:       { list: ["Claude", "Codex"], comment: "meta: this CV was probably reviewed by one of these" },
    robotics: { list: ["Universal Robot", "OnRobot", "Machine Vision", "PLC"], comment: "surprise!" },
  },
  skillNote: { key: "willRefactorYourEntireCodebaseIf", value: "evidence justifies it", comment: "(often)" },
  programmingLanguages: [
    { name: "TypeScript", icon: "typescript(1).svg" },
    { name: "JavaScript", icon: "javascript(1).svg" },
    { name: "CSS", icon: "css(1).svg" },
    { name: "SCSS", icon: "scss(1).svg" },
    { name: "HTML", icon: "html(1).svg" },
    { name: "Python", icon: "python(1).svg" },
    { name: "PHP", icon: "php(1).svg" }
  ],
  community: "Launched and lead a pro bono after-school IT and programming club at Mátyás Király Street Primary School, Pécs (Feb 2026, ongoing). Designed the full curriculum. Under my mentorship, the team won 1st place at the 2026 \"Hack and Code\" competition (Radnóti SZKI) and placed 1st and 3rd at the 22nd Neumann János Programming Competition.",
  hobbyProjects: [
    { name: "Real-time Space Travel", url: "https://github.com/exphoenee/realtime_space_travel" },
    { name: "Sudoku Solver API", url: "https://github.com/exphoenee/SudokuSolver-API" },
    { name: "Bullseyes", url: "https://github.com/exphoenee/bullseyes" },
    { name: "Space Dodge", url: "https://github.com/BZZYFMLY/Space-dodge" },
    { name: "Arrganizer", url: "https://github.com/ViktorBozzay/Arrganizer" },
    { name: "Space Game", url: "https://github.com/exphoenee/SpaceGame" },
    { name: "Rock Paper Scissors", url: "https://github.com/exphoenee/RockPaperScissors" },
    { name: "Auditorium", url: "https://github.com/exphoenee/auditorium" },
    { name: "BA Team", url: "https://exphoenee.github.io/ba-team-docs/#home" },
    { name: "domelemjs", url: "https://www.npmjs.com/package/domelemjs" },
    { name: "romannumbersjs", url: "https://www.npmjs.com/package/romannumbersjs" }
  ]
};
