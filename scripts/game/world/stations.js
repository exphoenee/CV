/**
 * stations.js
 * CV Stations (Houses) content and coordinate details.
 */
export const CV_STATIONS = [
    {
        id: 'welcome',
        x: 180,
        y: 100,
        title: 'Personal HQ & Contact Details',
        tech: 'Frontend Tech Lead · Pécs, HU',
        content: `
<h3>Viktor Bozzay</h3>
<p><strong>Role:</strong> Frontend Tech Lead (deliberate, evidence-driven, system-level thinker)</p>
<p><strong>Location:</strong> Pécs, Hungary</p>
<p><strong>Email:</strong> bozzay.viktor@gmail.com</p>
<p><strong>Phone:</strong> +36306106608</p>
<p><strong>GitHub:</strong> github.com/exphoenee</p>
<p><strong>LinkedIn:</strong> linkedin.com/in/viktorbozzay</p>
<hr/>
<h3>Languages</h3>
<ul>
  <li><strong>Hungarian:</strong> native (no runtime errors)</li>
  <li><strong>German:</strong> B2 (can order Schnitzel and read stack traces)</li>
  <li><strong>English:</strong> B2 (you are reading this proof)</li>
</ul>
<hr/>
<h3>Summary</h3>
<p>Frontend developer who operates at the architecture level—not just building features, but evaluating whether the foundation they sit on is worth keeping. Led full rewrites of legacy systems, migrated codebases to modern stacks, and designed AI-assisted development workflows that measurably accelerate delivery.</p>
        `
    },
    {
        id: 'webforsol',
        x: 420,
        y: 100,
        title: 'WebforSol (Freelance)',
        tech: 'React · Next.js · NestJS · PHP · Laravel · MySQL · MongoDB',
        content: `
<h3>WebforSol (Freelance)</h3>
<p><strong>Period:</strong> Jun 2020 – Nov 2022</p>
<p><strong>Title:</strong> Freelance Full Stack Developer</p>
<hr/>
<h3>Highlights</h3>
<ul>
  <li>Delivered bespoke full-stack custom applications, matching high availability requirements.</li>
  <li>Designed and integrated clean database migrations and modular REST APIs.</li>
  <li>Delivered custom solutions for clients using Svelte, React, Node.js, and PHP.</li>
  <li><strong>Reference projects:</strong> szelacoaching.hu, pecscoach.hu, smartedu.hu</li>
 </ul>
        `
    },
    {
        id: 'cobotx',
        x: 660,
        y: 100,
        title: 'CobotX Technologies',
        tech: 'Universal Robots · PLC · Machine Vision · Python',
        content: `
<h3>CobotX Technologies</h3>
<p><strong>Period:</strong> Aug 2021 – Aug 2022</p>
<p><strong>Title:</strong> Technical Project Manager</p>
<p><strong>Team size:</strong> 4 engineers (built and led personally)</p>
<hr/>
<h3>Highlights</h3>
<ul>
  <li>Engineering Manager at a high-tech robotics integrator, bridging mechanical engineering with modern software delivery.</li>
  <li>Literal robots. Universal Robots. Not metaphorical ones!</li>
  <li>Developed hardware/software specifications for PLC and robotics automation.</li>
  <li>Created capacity and financial plans aligned with sales forecasts.</li>
  <li>Set team KPIs, optimized documentation standards, and reported directly to board.</li>
</ul>
        `
    },
    {
        id: 'cubicfox',
        x: 900,
        y: 100,
        title: 'Cubicfox Technologies',
        tech: 'React · Next.js · TypeScript · SCSS · Jest · Webpack',
        content: `
<h3>Cubicfox</h3>
<p><strong>Period:</strong> Sep 2022 – Jan 2023</p>
<p><strong>Title:</strong> Frontend Developer</p>
<hr/>
<h3>Highlights</h3>
<ul>
  <li>Contributed to establishing the team's strict frontend code conventions and standards.</li>
  <li>Responsive, cross-browser UI development with strict pixel-perfect quality standards.</li>
  <li>Redesigned client requirements gathering—resulted in clearer specs and fewer revision cycles.</li>
  <li><strong>Key project:</strong> fundmypitch.com</li>
</ul>
        `
    },
    {
        id: 'scolia',
        x: 1140,
        y: 100,
        title: 'Scolia Technologies',
        tech: 'React · Redux Saga · WebSocket · MongoDB · Webpack',
        content: `
<h3>Scolia Technologies Ltd.</h3>
<p><strong>Period:</strong> Jan 2023 – Jul 2023</p>
<p><strong>Title:</strong> Frontend Developer</p>
<p><strong>Domain:</strong> Real-time automatic scorekeeping for steel-tip darts.</p>
<hr/>
<h3>Highlights</h3>
<ul>
  <li>Built responsive, dynamic UIs where milliseconds matter and the UI has to keep up with flying darts.</li>
  <li>Created interactive canvas-based visualizations for real-time progress tracking.</li>
  <li>Integrated low-latency WebSocket live score feeds.</li>
  <li><strong>Reference:</strong> scoliadarts.com</li>
</ul>
        `
    },
    {
        id: 'telekom',
        x: 180,
        y: 340,
        title: 'Deutsche Telekom IT Solutions',
        tech: 'React · TypeScript · Redux · Webpack · Agile',
        content: `
<h3>Deutsche Telekom IT Solutions HU</h3>
<p><strong>Period:</strong> Jul 2023 – Nov 2023</p>
<p><strong>Title:</strong> Developer</p>
<hr/>
<h3>Highlights</h3>
<ul>
  <li>Fast-paced, enterprise Agile environment with continuous frontend-AI backend integration.</li>
  <li>Built type-safe UI components integrated with AI-driven testing systems.</li>
  <li>Created intuitive dashboards for managing and viewing automated cloud test suites.</li>
  <li><strong>Reference:</strong> mobiledevice.cloud/order/ai4test</li>
</ul>
        `
    },
    {
        id: 'aegex',
        x: 420,
        y: 340,
        title: 'Aegex Technologies (Current)',
        tech: 'Svelte · React · TypeScript · Node.js · Express · MySQL · Vitest · Claude AI',
        content: `
<h3>Aegex Technologies</h3>
<p><strong>Period:</strong> Nov 2023 – Present</p>
<p><strong>Title:</strong> Frontend Tech Lead (Self + 1 mid-level colleague)</p>
<hr/>
<h3>SafeSy (Internal Manufacturing System)</h3>
<ul>
  <li>Designed and built the internal Aegex Svelte component library used across all applications.</li>
  <li>Manages real-time workflows, inventory, and tracking across all user roles.</li>
  <li>Contributed to Express backend including SQL query optimization.</li>
</ul>
<h3>FACTS (Feedstock & Compliance Tracking)</h3>
<ul>
  <li>CI pipeline with automated quality checks introduced from scratch.</li>
  <li>Migrated codebases to a robust PNPM monorepo, extracting shared driver packages.</li>
  <li>Claude AI-assisted dev workflows cut release cycle from 30 days down to 14 days (targeting 7).</li>
  <li><strong>References:</strong> facts.aegex.com, driver.aegex.com</li>
</ul>
        `
    },
    {
        id: 'education',
        x: 780,
        y: 340,
        title: 'Education, Community & Projects',
        tech: 'University of Pécs · Neumann János Awards · Hobby Arcade',
        content: `
<h3>Education (University of Pécs)</h3>
<ul>
  <li><strong>Bachelor's in Quality Manager</strong> (2003–2007)</li>
  <li><strong>Bachelor's in Machinery Technical Teacher</strong> (2001–2004)</li>
  <li><strong>BEng in Mechanical Engineering</strong> (2000–2004)</li>
</ul>
<hr/>
<h3>Community & Mentorship</h3>
<ul>
  <li>Pro bono after-school programming club mentor at Mátyás Király Street Primary School, Pécs (since Feb 2026).</li>
  <li><strong>Hack and Code 2026:</strong> 1st place!</li>
  <li><strong>22nd Neumann János Programming Competition:</strong> 1st and 3rd places!</li>
  <li><strong>romannumbersjs / domelemjs:</strong> npm libraries</li>
</ul>
        `
    }
];
