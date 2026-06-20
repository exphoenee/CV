// @job-application: 2026-06-20_1043_clickup_senior-frontend-engineer — Senior Frontend Engineer @ ClickUp (2026-06-20) · snapshot: cv-versions/2026-06-20_1043_clickup_senior-frontend-engineer/
// @cv-last-change: 2026-06-20 1202 — job-apply (job-apply-orchestrator) · see cv-versions/history.md
export const HU = {
  content: {
    summary:
      'Senior Frontend Engineer több mint 5 év React és TypeScript tapasztalattal. Szakterületem a frontend architektúra, Redux-stílusú állapotkezelés, komponensrendszerek és teljesítményoptimalizálás. Vállalati rendszerek újraírását vezettem, CI-vezérelt tesztekkel (Jest, Vitest, Playwright) és AI-asszisztált munkafolyamatokkal, amelyek megduplázták a kiadási gyakoriságot. Mérnököket mentorálok, evidencián alapuló refaktorálást támogatok, és akadálymentes, böngészőfüggetlen frontendre fókuszálok.',
    workExperience: [
      {
        id: 'aegex',
        description:
          'A SafeSy és FACTS rendszerek teljes körű architektúrális modernizációját vezettem — a rendszertervezéstől az éles üzemig. AI-asszisztált fejlesztési folyamatokat és CI-vezérelt minőségi pipeline-okat honosítottam meg, amelyek evidenciaalapú mérnöki kultúrát teremtettek és jelentősen növelték a szállítási sebességet és a kiadási megbízhatóságot.',
        bullets: [
          'Aegex két vállalati React/TypeScript rendszerének (SafeSy, FACTS) architektúráját és end-to-end szállítását vettem a kezembe, beleértve a rendszertervezést, a Redux-stílusú állapotkezeléssel ellátott UI architektúrát, valamint a backend és integrációs csapatokkal való szoros együttműködést',
          'Legacy rendszerek modernizációját vezettem teljes újraírással és modern frontend stack-re való migrációval',
          'AI-asszisztált fejlesztési munkafolyamatokat vezettem be, növelve a mérnöki teljesítményt és konzisztenciát',
          'CI pipeline-t implementáltam automatizált tesztekkel (Jest, Vitest, Playwright) és minőségi kapukkal, a tesztlefedettséget a nulláról építve fel, jelentősen csökkentve a production hibákat',
          'Evidenciaalapú refaktorálási folyamatot hoztam létre mérhető minőségjavulással',
          'Jelenleg 1 mid-level mérnököt mentorálok és vezetek',
        ],
        projects: [
          {
            name: 'SafeSy',
            subtitle: 'Belső gyártásirányítási rendszer',
            bullets: [
              'Többszerepkörös vállalati platformot építettem valós idejű munkafolyamat- és készletkövetéssel (gyártás, iroda, vezető, partner)',
              'Belső Svelte komponenskönyvtárat terveztem és valósítottam meg platformszinten',
              'Automatizált riporting megoldások tervezése és fejlesztése; hozzájárulás az Express alapú backend rendszer adatmodelljének, SQL lekérdezéseinek és teljesítményének optimalizálásához.',
            ],
          },
          {
            name: 'FACTS',
            subtitle: 'Nyersanyag- és megfelelőségkövetési rendszer',
            bullets: [
              'Kiadási ciklust haviról kéthetire csökkentettem (cél: heti) Claude-alapú AI-asszisztált toolinggal',
              'CI/CD pipeline fejlesztése automatizált quality gate-ekkel; átfogó tesztelési infrastruktúra és tesztlefedettség kiépítése nulláról.',
              'Architektúrát PNPM monorepora migráltam, FACTS/Driver/Shared csomaggal ',
              'Belső CLI toolingot építettem monorepo workflow-automatizáláshoz és fejlesztői produktivitáshoz',
            ],
          },
        ],
      },
      {
        id: 'telekom',
        description:
          'Vállalati agilis környezetben dolgoztam egy AI-integrált frontend rendszeren, fókuszálva a valós idejű adatvizualizációra és frontend-backend integrációra. Típusbiztos UI komponenseket építettem és hozzájárultam az AI-vezérelt tesztelési munkafolyamatokhoz és elemzési interfészekhez.',
        bullets: [
          'Type-safe React-alapú UI komponenseket fejlesztettem Redux állapotkezeléssel vállalati AI-integrált rendszerekhez, együttműködve a backend csapatokkal az API integrációs munkafolyamatokon',
          'Frontend interfészeket integráltam AI-vezérelt backend szolgáltatásokkal API munkafolyamatokon keresztül',
          'Valós idejű adatvizualizációs interfészeket építettem teszteredményekhez és rendszerelemzéshez',
          'Agilis fejlesztési környezetben dolgoztam a frontend és backend rendszerek folyamatos integrációjával',
        ],
      },
      {
        id: 'scolia',
        description:
          'Frontend fejlesztőként dolgoztam a Scoliánál, egy acélhegyű darts valós idejű automatikus pontszámláló megoldásánál:',
        bullets: [
          'A dizájn és backend csapatokkal együttműködve alacsony késleltetésű, nagy áteresztőképességű valós idejű UI-t szállítottam élő adatterhelés alatt.',
          'Interaktív vizualizációkat hoztam létre valós idejű haladáskövetéshez és teljesítmény-elemzéshez.',
        ],
      },
      {
        id: 'cubicfox',
        description:
          'Production ready frontend alkalmazásokat szállítottam nemzetközi ügyfelek számára agilis környezetben. Skálázható UI architektúrára, frontend szabványokra és a stakeholderek és fejlesztési csapatok közötti igénytisztázás javítására összpontosítottam.',
        bullets: [
          'Production ready React és Next.js frontend alkalmazásokat fejlesztettem nemzetközi ügyfeleknek',
          'Javítottam a frontend architektúra konzisztenciáját kódszabványok meghatározásával és érvényesítésével a csapatban',
          'Újraterveztem az ügyféligény-összegyűjtési folyamatot, csökkentve a félreérthetőséget és az iterációs köröket',
          'Együttműködtem a dizájn és backend csapatokkal skálázható, böngészőfüggetlen UI rendszerek szállításáért',
        ],
      },
      {
        id: 'cobotx',
        description:
          'Ipari robotikai és automatizálási mérnöki projekteket vezettem, összekötve a gépészmérnöki, PLC-rendszer és szoftveralapú automatizálási szaktudást. Felelős voltam a rendszerspecifikációért, csapatvezetésért és szállítástervezésért termelés-kritikus környezetekben.',
        bullets: [
          'Hardware és software specifikációkat fejlesztettem PLC-alapú robotikai és automatizálási rendszerekhez',
          'Műszaki követelményeket és megvalósíthatósági tanulmányokat definiáltam ipari robotikai megoldásokhoz',
          '4 mérnökből álló csapatot építettem fel és vezettem, felügyelve a szállítást, teljesítményt és a projekt végrehajtását',
          'KPI-okat, dokumentációs szabványokat és riportálási folyamatokat hoztam létre a mérnöki tevékenységekhez',
          'Kapacitás- és pénzügyi terveket készítettem az értékesítési és gyártási előrejelzésekhez igazodva',
        ],
      },
      {
        id: 'webforsol',
        description:
          'Full-stack webes alkalmazásokat szállítottam egyáni vállalkozó fejlesztőként különböző iparágak ügyfelei számára. Rendszertervezésre, karbantartható architektúrára és skálázható webes megoldások teljes körű szállítására összpontosítottam.',
        bullets: [
          'Full-stack alkalmazásokat építettem React, Next.js, Node.js, PHP és relációs/nem relációs adatbázisok segítségével',
          'REST API-okat és moduláris backend architektúrákat terveztem és valósítottam meg kliens rendszerekhez',
          'Teljes körű termékfejlesztést végeztem az igényelemzéstől az üzembe helyezésig és karbantartásig',
          'Közvetlenül ügyfelekkel dolgoztam az üzleti igények skálázható technikai megoldásokra való fordításáért',
          'Optimalizáltam az alkalmazás struktúráját a karbantarthatóság, bővíthetőség és hosszú távú skálázhatóság érdekében',
        ],
      },
    ],
    community:
      'Pro bono ingyenes iskolai informatika és programozási szakkört indítottam és vezetek a pécsi Mátyás Király Utcai Általános Iskolában (2026. február, folyamatban). Teljes tananyagot terveztem. Mentorálásomnak köszönhetően a csapat első helyet szerzett a 2026-os „Hack and Code" versenyen (Radnóti SZKI), és 1. és 3. helyet szerzett a 22. Neumann János Programozási Versenyen.',
    identity: {
      languages: [
        { name: 'Magyar', level: 'Anyanyelv', comment: null },
        { name: 'Német', level: 'Felső-középhaladó (B2)', comment: null },
        { name: 'Angol', level: 'Felső-középhaladó (B2)', comment: null },
      ],
    },
  },
};
