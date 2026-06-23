/**
 * cv-data.js — Job Application Snapshot
 * @job-application: 2026-06-22_galactic-fleet_senior-software-engineer-frontend-focus
 * @title: Senior Software Engineer / Frontend focus
 * @company: Galactic Fleet
 * @seniority: senior
 * @domain: gaming, voice-controlled AI entertainment
 * @ats-score: 60%
 * @operation: job-apply
 * @actor: job-apply-orchestrator
 * @date: 2026-06-22
 */
// @job-application: 2026-06-22_molin-ai_senior-software-engineer — Senior Software Engineer @ Molin AI (2026-06-22) · snapshot: cv-versions/2026-06-22_molin-ai_senior-software-engineer/
// @cv-last-change: 2026-06-22 0909 — job-apply (job-apply-orchestrator) · see cv-versions/history.md
/**
 * cv-data.js
 * Central CV data object — single source of truth for all CV views.
 * Load before any view-specific script.
 */
export const CV_DATA = {
  meta: {
    name: 'Viktor Bozzay',
    role: 'Frontend Tech Lead',
    version: '4.2.0',
    accentColor: '#ff7024',
    description: 'Curriculum Vitae',
  },
  identity: {
    name: 'Viktor Bozzay',
    role: 'Developer',
    location: 'Pécs, Hungary',
    contacts: [
      { label: 'Pecs, Hungary', url: null },
      {
        label: 'linkedin.com/in/viktorbozzay',
        url: 'https://linkedin.com/in/viktorbozzay/',
      },
      { label: 'github.com/exphoenee', url: 'https://github.com/exphoenee' },
      { label: 'bozzayviktor.hu', url: 'https://www.bozzayviktor.hu' },
      { label: 'bozzay.viktor@gmail.com', url: 'mailto:bozzay.viktor@gmail.com' },
      { label: '+36306106608', url: null },
    ],
    languages: [
      { name: 'Hungarian', level: 'Native', comment: null },
      { name: 'German', level: 'Upper Intermediate (B2)', comment: null },
      { name: 'English', level: 'Upper Intermediate (B2)', comment: null },
    ],
    game: {
      x: 180,
      y: 100,
      tech: 'Frontend Tech Lead · Pécs, HU',
      description: 'Personal HQ & Contact Details',
    },
  },
  summary:
    "Frontend Developer with 5+ years of experience building interactive, production web applications with React, TypeScript, and Node.js. I've developed real-time, data-driven interfaces including WebSocket-based live systems and cross-platform UI solutions. I'm a power user of Claude Code and Codex, using AI to accelerate development. I focus on clean code, performant architecture, and creating engaging user experiences across devices.",
  workExperience: [
    {
      id: 'aegex',
      company: 'Aegex Technologies',
      logo: 'aegex.png',
      title: 'Frontend Tech Lead',
      period: { from: '2023-11', to: null },
      periodLabel: 'Nov 2023 - Present',
      isCurrent: true,
      teamSize: 2,

      description:
        'I led the architectural modernization of two enterprise legacy systems. I own end-to-end delivery of SafeSy and FACTS, including system design, frontend architecture, and backend integration. I introduced AI-assisted development workflows and CI-driven quality pipelines, enabling an evidence-based engineering process and significantly improving delivery speed and release reliability.',

      bullets: [
        'I built interactive, real-time frontend experiences for two enterprise platforms (SafeSy, FACTS) — architecture, UI, API integration, and deployment — with React, TypeScript, and Node.js',
        'I led the modernization of legacy systems through full rewrites and migration to modern frontend stacks',
        'I introduced AI-assisted development workflows improving engineering throughput and consistency',
        'I implemented a CI pipeline with automated quality gates and testing strategy from scratch',
        'I established an evidence-driven refactoring process with measurable quality improvements',
        "I'm currently mentoring and leading 1 mid-level engineer",
      ],

      projects: [
        {
          name: 'SafeSy',
          subtitle: 'Internal Manufacturing Management System',
          bullets: [
            'I built a cross-role enterprise platform for production, office, executives, and partners with real-time workflow and inventory tracking',
            'I designed and implemented a reusable internal Svelte component library used across the platform',
            'I developed a subscribable daily email reporting system and contributed to the Express backend (including SQL query design and optimization)',
          ],
        },
        {
          name: 'FACTS',
          subtitle: 'Feedstock and Compliance Tracking System',
          bullets: [
            'I reduced the release cycle from monthly to biweekly (target: weekly) using AI-assisted development workflows (Claude-based tooling)',
            'I introduced a CI pipeline with automated quality gates; I established test coverage from zero and significantly reduced production issues',
            'I migrated the architecture to a PNPM monorepo and extracted the shared FACTS/Driver package for reuse',
            'I built internal CLI tooling for monorepo workflow automation and developer productivity',
          ],
        },
      ],

      skills: [
        { name: 'Svelte', icon: 'svelte.svg' },
        { name: 'React', icon: 'react.svg' },
        { name: 'TypeScript', icon: 'typescript.svg' },
        { name: 'Node.js', icon: 'nodeJS.svg' },
        { name: 'ExpressJS', icon: 'ExpressJS.svg' },
        { name: 'MySQL', icon: 'mysql.svg' },
        { name: 'Python', icon: 'python.svg' },
        { name: 'SCSS', icon: 'scss.svg' },
        { name: 'Vite', icon: 'vite.svg' },
        { name: 'PNPM', icon: 'pnpm.svg' },
        { name: 'Jest', icon: 'jest.svg' },
        { name: 'Vitest', icon: 'vitest.svg' },
        { name: 'Playwright', icon: 'playwright.svg' },
        { name: 'Claude', icon: 'claude.svg' },
        { name: 'Codex', icon: 'codex.svg' },
      ],

      refs: [
        { url: 'https://facts.aegex.com', label: 'facts.aegex.com' },
        { url: 'https://driver.aegex.com', label: 'driver.aegex.com' },
      ],

      game: {
        x: 437,
        y: 340,
        tech: 'Svelte · React · TypeScript · Node.js · Express · MySQL · Vitest · Claude AI',
        description: 'Aegex Technologies (Current)',
      },

      hasDecor: true,
    },
    {
      id: 'telekom',
      company: 'Deutsche Telekom IT Solutions HU',
      logo: 'telekom.png',
      title: 'Developer',
      period: { from: '2023-07', to: '2023-11' },
      periodLabel: 'Jul 2023 - Nov 2023',
      isCurrent: false,

      description:
        'I worked in an enterprise Agile environment on an AI-integrated frontend system, focusing on real-time data visualization and frontend-backend integration. I built type-safe UI components and contributed to AI-driven testing workflows and analysis interfaces.',

      bullets: [
        'I developed type-safe React-based UI components for enterprise AI-integrated systems',
        'I integrated frontend interfaces with AI-driven backend services via API workflows',
        'I built real-time data visualization interfaces for test results and system analysis',
        'I worked in an Agile delivery environment with continuous integration of frontend and backend systems',
      ],

      skills: [
        { name: 'React', icon: 'react.svg' },
        { name: 'TypeScript', icon: 'typescript.svg' },
        { name: 'Node.js', icon: 'nodeJS.svg' },
        { name: 'React Redux', icon: 'react_redux.svg' },
        { name: 'Styled Components', icon: 'styled_components.svg' },
        { name: 'Webpack', icon: 'webpack.svg' },
        { name: 'Jest', icon: 'jest.svg' },
        { name: 'NPM', icon: 'npm.svg' },
      ],

      refs: [
        {
          url: 'https://mobiledevice.cloud/order/ai4test',
          label: 'AI4Test Platform',
        },
      ],

      game: {
        x: 183,
        y: 342,
        tech: 'React · TypeScript · Redux · Webpack · Agile',
        description: 'Deutsche Telekom IT Solutions',
      },

      hasDecor: false,
    },
    {
      id: 'scolia',
      company: 'Scolia Technologies Ltd.',
      logo: 'scolia.png',
      title: 'Frontend Developer',
      period: { from: '2023-01', to: '2023-07' },
      periodLabel: 'Jan 2023 - Jul 2023',
      isCurrent: false,

      description:
        'I developed real-time frontend interfaces for an automated sports scoring and analytics platform. I focused on low-latency UI updates, live data visualization, and responsive user experience in a high-frequency data environment.',

      bullets: [
        'I built a real-time React-based UI for live sports scoring and match tracking',
        'I implemented low-latency data visualization components for live performance analytics',
        'I integrated WebSocket-based real-time data streams into the frontend architecture',
        'I partnered with design and backend teams to ship low-latency, high-throughput real-time UI under live data load',
      ],

      skills: [
        { name: 'React', icon: 'react.svg' },
        { name: 'Redux Saga', icon: 'redux_saga.svg' },
        { name: 'WebSocket', icon: 'websocket.svg' },
        { name: 'JavaScript', icon: 'javascript.svg' },
        { name: 'SCSS', icon: 'scss.svg' },
        { name: 'CSS', icon: 'css.svg' },
        { name: 'HTML', icon: 'html.svg' },
        { name: 'MongoDB', icon: 'mongodb.svg' },
        { name: 'Jest', icon: 'jest.svg' },
        { name: 'Webpack', icon: 'webpack.svg' },
      ],

      refs: [{ url: 'https://scoliadarts.com', label: 'scoliadarts.com' }],

      game: {
        x: 1142,
        y: 100,
        tech: 'React · Redux Saga · WebSocket · MongoDB · Webpack',
        description: 'Scolia Technologies',
      },

      hasDecor: true,
    },
    {
      id: 'cubicfox',
      company: 'Cubicfox',
      logo: 'cubicfox.png',
      title: 'Frontend Developer',
      period: { from: '2022-09', to: '2023-01' },
      periodLabel: 'Sep 2022 - Jan 2023',
      isCurrent: false,

      description:
        'I delivered production-grade frontend applications for international clients in an Agile environment. I focused on scalable UI architecture, frontend standards, and improving requirement clarity between stakeholders and development teams.',

      bullets: [
        'I built production-ready React and Next.js frontend applications for international clients',
        'I improved frontend architecture consistency by defining and enforcing code standards across the team',
        'I redesigned the client requirement gathering process, reducing ambiguity and iteration cycles',
        'I collaborated with design and backend teams to deliver scalable, cross-browser UI systems',
      ],

      skills: [
        { name: 'React', icon: 'react.svg' },
        { name: 'Next.js', icon: 'nextjs.svg' },
        { name: 'TypeScript', icon: 'typescript.svg' },
        { name: 'JavaScript', icon: 'javascript.svg' },
        { name: 'SCSS', icon: 'scss.svg' },
        { name: 'Styled Components', icon: 'styled_components.svg' },
        { name: 'HTML', icon: 'html.svg' },
        { name: 'CSS', icon: 'css.svg' },
        { name: 'Jest', icon: 'jest.svg' },
        { name: 'Webpack', icon: 'webpack.svg' },
        { name: 'NPM', icon: 'npm.svg' },
      ],

      refs: [{ url: 'https://www.fundmypitch.com', label: 'fundmypitch.com' }],

      game: {
        x: 892,
        y: 102,
        tech: 'React · Next.js · TypeScript · SCSS · Jest · Webpack',
        description: 'Cubicfox Technologies',
      },

      hasDecor: true,
    },
    {
      id: 'cobotx',
      company: 'CobotX Technologies',
      logo: 'cobotx.png',
      title: 'Engineering Manager',
      period: { from: '2021-08', to: '2022-08' },
      periodLabel: 'Aug 2021 - Aug 2022',
      isCurrent: false,

      description:
        'I led engineering projects in industrial robotics and automation, bridging mechanical engineering, PLC systems, and software-driven automation. I was responsible for system specification, team leadership, and delivery planning in production-critical environments.',

      bullets: [
        'I developed hardware and software specifications for PLC-based robotics and automation systems',
        'I defined technical requirements and conducted feasibility studies for industrial robotic solutions',
        'I built and led a team of 4 engineers, overseeing delivery, performance, and project execution',
        'I established KPIs, documentation standards, and reporting processes for engineering operations',
        'I created capacity and financial plans aligned with sales and production forecasts',
      ],

      skills: [
        { name: 'Industrial Automation', icon: 'industrial_automation.svg' },
        { name: 'Robot Applications', icon: 'robot_applications.svg' },
        { name: 'PLC Systems', icon: 'plc_systems.svg' },
        { name: 'Universal Robot', icon: 'universal_robot.svg' },
        { name: 'OnRobot', icon: 'OnRobot.svg' },
        { name: 'Machine Vision', icon: 'machine_vision.svg' },
        { name: 'Project Management', icon: 'project_management.svg' },
        { name: 'Python', icon: 'python.svg' },
        { name: 'OnShape', icon: 'OnShape.svg' },
        { name: 'Mechanical Engineering', icon: 'mechanical_engineering.svg' },
      ],

      refs: [],

      game: {
        x: 661,
        y: 104,
        tech: 'Universal Robots · PLC · Machine Vision · Python',
        description: 'CobotX Technologies',
      },

      hasDecor: false,
    },
    {
      id: 'webforsol',
      company: 'WebforSol',
      logo: 'websol.png',
      title: 'Freelancer Full Stack Developer',
      period: { from: '2020-06', to: '2022-11' },
      periodLabel: 'Jun 2020 - Nov 2022',
      isCurrent: false,

      description:
        'I delivered full-stack web applications as an independent developer for clients across multiple industries. I focused on system design, maintainable architecture, and end-to-end delivery of scalable web solutions.',

      bullets: [
        'I built full-stack applications using React, Next.js, Node.js, PHP, and relational/non-relational databases',
        'I designed and implemented REST APIs and modular backend architectures for client systems',
        'I delivered end-to-end product development from requirement analysis to deployment and maintenance',
        'I worked directly with clients to translate business needs into scalable technical solutions',
        'I optimized application structure for maintainability, extensibility, and long-term scalability',
      ],

      skills: [
        { name: 'React', icon: 'react.svg' },
        { name: 'Next.js', icon: 'nextjs.svg' },
        { name: 'Node.js', icon: 'nodeJS.svg' },
        { name: 'PHP', icon: 'php.svg' },
        { name: 'Laravel', icon: 'Laravel.svg' },
        { name: 'MySQL', icon: 'mysql.svg' },
        { name: 'MongoDB', icon: 'mongodb.svg' },
        { name: 'JavaScript', icon: 'javascript.svg' },
        { name: 'TypeScript', icon: 'typescript.svg' },
        { name: 'CSS', icon: 'css.svg' },
        { name: 'jQuery', icon: 'jquery.svg' },
        { name: 'NestJS', icon: 'NestJS.svg' },
      ],

      refs: [
        { url: 'https://szelacoaching.hu', label: 'szelacoaching.hu' },
        { url: 'https://www.pecscoach.hu', label: 'pecscoach.hu' },
        { url: 'https://smartedu.hu', label: 'smartedu.hu' },
      ],

      game: {
        x: 439,
        y: 102,
        tech: 'React · Next.js · NestJS · PHP · Laravel · MySQL · MongoDB',
        description: 'WebforSol (Freelance)',
      },

      hasDecor: true,
    },
  ],
  education: {
    institution: 'Faculty of Engineering and Information Technology - University of Pécs',
    degrees: [
      { title: "Bachelor's degree, Quality Manager", years: '2003 - 2007' },
      {
        title: "Bachelor's degree, Machinery Technical Teacher Education",
        years: '2001 - 2004',
      },
      {
        title: 'Bachelor of Engineering (BEng), Mechanical Engineering',
        years: '2000 - 2004',
      },
    ],
    game: {
      x: 762,
      y: 338,
      tech: 'University of Pécs · Neumann János Awards · Hobby Arcade',
      description: 'Education, Community & Projects',
    },
  },
  skillGroups: {
    primary: {
      list: ['TypeScript', 'JavaScript', 'React', 'Svelte', 'Node.js', 'SCSS', 'HTML', 'CSS'],
      comment: null,
    },
    backend: {
      list: ['Express.js', 'NestJS', 'Python', 'PHP', 'MySQL', 'MongoDB', 'REST API', 'WebSocket'],
      comment: null,
    },
    testing: {
      list: ['Jest', 'Vitest', 'Playwright'],
      comment: 'yes, all three',
    },
    tooling: { list: ['Vite', 'Webpack', 'PNPM', 'Next.js', 'CI/CD'], comment: null },
    ai: {
      list: ['Claude', 'Codex'],
      comment: 'meta: this CV was probably reviewed by one of these',
    },
    robotics: {
      list: ['Universal Robot', 'OnRobot', 'Machine Vision', 'PLC'],
      comment: 'surprise!',
    },
  },
  skillNote: {
    key: 'willRefactorYourEntireCodebaseIf',
    value: 'evidence justifies it',
    comment: '(often)',
  },
  programmingLanguages: [
    { name: 'TypeScript', icon: 'typescript.svg' },
    { name: 'JavaScript', icon: 'javascript.svg' },
    { name: 'CSS', icon: 'css.svg' },
    { name: 'SCSS', icon: 'scss.svg' },
    { name: 'HTML', icon: 'html.svg' },
    { name: 'Python', icon: 'python.svg' },
    { name: 'PHP', icon: 'php.svg' },
  ],
  community:
    'I launched and currently lead a pro bono after-school IT and programming club at Mátyás Király Street Primary School, Pécs (Feb 2026, ongoing). I designed the full curriculum. Under my mentorship, the team won 1st place at the 2026 "Hack and Code" competition (Radnóti SZKI) and placed 1st and 3rd at the 22nd Neumann János Programming Competition.',
  hobbyProjects: [
    {
      name: 'Real-time Space Travel',
      url: 'https://github.com/exphoenee/realtime_space_travel',
    },
    {
      name: 'Sudoku Solver API',
      url: 'https://github.com/exphoenee/SudokuSolver-API',
    },
    { name: 'Bullseyes', url: 'https://github.com/exphoenee/bullseyes' },
    { name: 'Space Dodge', url: 'https://github.com/BZZYFMLY/Space-dodge' },
    { name: 'Arrganizer', url: 'https://viktorbozzay.github.io/ArrganizerDocs/' },
    { name: 'Space Game', url: 'https://github.com/exphoenee/SpaceGame' },
    {
      name: 'Rock Paper Scissors',
      url: 'https://github.com/exphoenee/RockPaperScissors',
    },
    { name: 'Auditorium', url: 'https://github.com/exphoenee/auditorium' },
    { name: 'BA Team', url: 'https://exphoenee.github.io/ba-team-docs/#home' },
    { name: 'domelemjs', url: 'https://www.npmjs.com/package/domelemjs' },
    {
      name: 'romannumbersjs',
      url: 'https://exphoenee.github.io/RomanNumbersJS/',
    },
    {
      name: 'createDOMBlocks',
      url: 'https://exphoenee.github.io/createDOMBlocks/',
    },
  ],
};

