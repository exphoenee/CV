// @job-application: 2026-06-23_1953_prestosports_software-engineer — Software Engineer @ PrestoSports (2026-06-23) · snapshot: cv-versions/2026-06-23_1953_prestosports_software-engineer/
// @cv-last-change: 2026-06-23 1957 — job-apply (job-apply-orchestrator) · see cv-versions/history.md
export const HU = {
  content: {
    summary:
      "Senior Frontend Engineer vagyok 5+ év tapasztalattal komplex webalkalmazások építésében React, TypeScript és modern eszközök (Vite, Webpack) segítségével. Erős technikai tudást párosítok product mindsettel — fókuszban az eredmények, használhatóság és skálázható belső platformok. Szállítottam vállalati belső platformokat adatvizualizációval, dashboardokkal és admin eszközökkel; építettem CI pipeline-okat minőségi kapukkal; és AI-asszisztált workflow-kat vezettem be minőségromlás nélkül. Erős tapasztalatom van state menedzsmentben (Redux), komponenskönyvtárakban és frontend architektúra teljes körű birtoklásában Agile/Scrum környezetben.",
    workExperience: [
      {
        id: "aegex",
        description:
          "A SafeSy és FACTS rendszerek teljes körű architektúrális modernizációját vezettem — a rendszertervezéstől az éles üzemig. AI-asszisztált fejlesztési folyamatokat és CI-vezérelt minőségi pipeline-okat honosítottam meg, amelyek evidenciaalapú mérnöki kultúrát teremtettek és jelentősen növelték a szállítási sebességet és a kiadási megbízhatóságot.",
        bullets: [
          "Két vállalati rendszer (SafeSy, FACTS) architektúráját és szállítását vettem a kezembe, a tervezéstől a produkcióig",
          "Legacy rendszerek modernizációját vezettem teljes újraírással és modern frontend stack-re való migrációval",
          "AI-asszisztált fejlesztési munkafolyamatokat vezettem be, növelve a mérnöki teljesítményt és konzisztenciát",
          "CI pipeline-t implementáltam automatizált minőségi kapukkal és tesztelési stratégiával a semmiből",
          "Evidenciaalapú refaktorálási folyamatot hoztam létre mérhető minőségjavulással",
          "Jelenleg 1 mid-level mérnököt mentorálok és vezetek",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Belső gyártásirányítási rendszer",
            bullets: [
              "Többszerepkörös vállalati belső platformot építettem valós idejű adatvizualizációval, analitikai dashboardokkal és admin eszközökkel (gyártás, iroda, vezető, partner)",
              "Belső Svelte komponenskönyvtárat terveztem és valósítottam meg platformszinten",
              "Automatizált riporting megoldások tervezése és fejlesztése; hozzájárulás az Express alapú backend rendszer adatmodelljének, SQL lekérdezéseinek és teljesítményének optimalizálásához.",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Nyersanyag- és megfelelőségkövetési rendszer",
            bullets: [
              "Kiadási ciklust haviról kéthetire csökkentettem (cél: heti) Claude-alapú AI-asszisztált toolinggal",
              "CI pipeline-t implementáltam automatizált minőségi kapukkal és átfogó tesztelési stratégiával, csökkentve a production hibákat és javítva a kiadási megbízhatóságot agilis fejlesztési környezetben",
              "Architektúrát PNPM monorepora migráltam, FACTS/Driver/Shared csomaggal ",
              "Belső CLI toolingot építettem monorepo workflow-automatizáláshoz és fejlesztői produktivitáshoz",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Vállalati agilis környezetben dolgoztam egy AI-integrált frontend rendszeren, fókuszálva a valós idejű adatvizualizációra és frontend-backend integrációra. Típusbiztos UI komponenseket építettem és hozzájárultam az AI-vezérelt tesztelési munkafolyamatokhoz és elemzési interfészekhez.",
        bullets: [
          "Type-safe React-alapú UI komponenseket fejlesztettem vállalati AI-integrált rendszerekhez",
          "Frontend interfészeket integráltam AI-vezérelt backend szolgáltatásokkal API munkafolyamatokon keresztül",
          "Valós idejű adatvizualizációs interfészeket építettem teszteredményekhez és rendszerelemzéshez",
          "Agilis fejlesztési környezetben dolgoztam a frontend és backend rendszerek folyamatos integrációjával",
        ],
      },
      {
        id: "scolia",
        description:
          "Frontend fejlesztőként dolgoztam a Scoliánál, egy darts valós idejű automatikus pontszámláló megoldásánál:",
        bullets: [
          "Valós idejű React-alapú UI-t építettem élő sportpontozáshoz magas megbízhatóságú környezetben",
          "Alacsony késleltetésű analitikai dashboardokat és vizualizációs komponenseket építettem élő teljesítménymutatókhoz",
          "WebSocket-alapú valós idejű adatfolyamokat integráltam a frontendbe",
          "Dizájn és backend csapatokkal szállítottam alacsony késleltetésű UI-t élő adatterhelés alatt",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Production ready frontend alkalmazásokat szállítottam nemzetközi ügyfelek számára agilis környezetben. Skálázható UI architektúrára, frontend szabványokra és a stakeholderek és fejlesztési csapatok közötti igénytisztázás javítására összpontosítottam.",
        bullets: [
          "Production ready React és Next.js frontend alkalmazásokat fejlesztettem nemzetközi ügyfeleknek",
          "Javítottam a frontend architektúra konzisztenciáját kódszabványok meghatározásával és érvényesítésével a csapatban",
          "Újraterveztem az ügyféligény-összegyűjtési folyamatot, csökkentve a félreérthetőséget és az iterációs köröket",
          "Együttműködtem a dizájn és backend csapatokkal skálázható, böngészőfüggetlen UI rendszerek szállításáért",
        ],
      },
      {
        id: "cobotx",
        description:
          "Ipari robotikai és automatizálási mérnöki projekteket vezettem, összekötve a gépészmérnöki, PLC-rendszer és szoftveralapú automatizálási szaktudást. Felelős voltam a rendszerspecifikációért, csapatvezetésért és szállítástervezésért termelés-kritikus környezetekben.",
        bullets: [
          "Hardware és software specifikációkat fejlesztettem PLC-alapú robotikai és automatizálási rendszerekhez",
          "Műszaki követelményeket és megvalósíthatósági tanulmányokat definiáltam ipari robotikai megoldásokhoz",
          "4 mérnökből álló csapatot építettem fel és vezettem, felügyelve a szállítást, teljesítményt és a projekt végrehajtását",
          "KPI-okat, dokumentációs szabványokat és riportálási folyamatokat hoztam létre a mérnöki tevékenységekhez",
          "Kapacitás- és pénzügyi terveket készítettem az értékesítési és gyártási előrejelzésekhez igazodva",
        ],
      },
      {
        id: "webforsol",
        description:
          "Full-stack webalkalmazásokat szállítottam egyéni fejlesztőként különböző iparágak számára, rendszertervezésre és karbantartható architektúrára fókuszálva.",
        bullets: [
          "Full-stack alkalmazásokat építettem React, Next.js, Node.js, PHP és relációs/nem relációs adatbázisok segítségével",
          "REST API-okat és moduláris backend architektúrákat terveztem és valósítottam meg kliens rendszerekhez",
          "Teljes körű termékfejlesztést végeztem az igényelemzéstől az üzembe helyezésig és karbantartásig",
          "Közvetlenül ügyfelekkel dolgoztam az üzleti igények skálázható technikai megoldásokra való fordításáért",
          "Optimalizáltam az alkalmazás struktúráját a karbantarthatóság, bővíthetőség és hosszú távú skálázhatóság érdekében",
        ],
      },
    ],

    community:
      'Pro bono IT és programozás szakkört indítottam és vezetek a pécsi Mátyás Király Utcai Általános Iskolában (2026. feb., folyamatban). Teljes tananyagot terveztem. Mentorálásommal a csapat 1. helyezést ért el a 2026-os „Hack and Code" versenyen (Radnóti SZKI), valamint 1. és 3. helyet a 22. Neumann János Programozási Versenyen.',

    identity: {
      languages: [
        {name: "Magyar", level: "Anyanyelv", comment: null},
        {name: "Német", level: "Felső-középhaladó (B2)", comment: null},
        {name: "Angol", level: "Felső-középhaladó (B2)", comment: null},
      ],
    },
  },
};
