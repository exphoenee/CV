export const HU = {
  labels: {
    cvOf: "Önéletrajza",
    roleLocation: "Frontend Tech Lead · Pécs, HU",
    chooseView: "Válaszd meg, hogyan tekinted meg az önéletrajzom",
    btnReadingLabel: "Olvasni szeretnék",
    btnReadingDesc: "Tiszta, olvasható, nyomtatható önéletrajz",
    btnFrontendLabel: "Frontend fejlesztő vagyok",
    btnFrontendDesc: "Swagger-stílusú API dokumentáció",
    btnBackendLabel: "Backend fejlesztő vagyok",
    btnBackendDesc: "JSON / VS Code nézet",
    btnGamerLabel: "Gamer vagyok",
    btnGamerDesc: "Interaktív 2.5D RPG világ",
    btnHireLabel: "Vegyél fel!",
    btnHireDesc: "Küldj nekem üzenetet",
    workExperience: "Munkatapasztalat",
    education: "Tanulmányok",
    languages: "Nyelvek",
    programmingLanguages: "Programozási nyelvek",
    hobbyProjects: "Hobbi projektek",
    community: "Közösség & Mentorálás",
    references: "Hivatkozás(ok):",
    hireMe: "Vegyél fel!",
    print: "🖸 Nyomtatás",
    poweredBy: "Készítette",
    current: "jelenlegi",
    contactTitle: "Kapcsolatfelvétel",
    yourName: "Neved",
    namePlaceholder: "Gipsz Jakab",
    yourEmail: "E-mail",
    emailPlaceholder: "email@domain.com",
    message: "Üzenet",
    messagePlaceholder: "Szia Viktor, szeretnénk...",
    send: "Küldés",
    messageSent: "Üzenet sikeresen elküldve.",
    close: "Bezárás",
    themeChanged: "Téma:",
    musicChangedTo: "Zene:",
    musicPaused: "szüneteltetve",
    musicPlaying: "lejátszás",
    nowPlaying: "Most játszik:",
    repeatNone: "Nincs ismétlés",
    repeatAll: "Összes ismétlése",
    repeatOne: "Egy ismétlése",
  },
  content: {
    summary:
      "Frontend mérnök, aki frontend architektúrára, rendszertervezésre és nagyszabású legacy rendszerek modernizációjára specializálódott. Vállalati rendszerek teljes újraírását és migrációját vezette modern technológiai stack-ekre, javítva az alapplatformok karbantarthatóságát és skálázhatóságát. AI-asszisztált fejlesztési munkafolyamatokat vezetett be, amelyek jelentősen növelték a szállítási sebességet, a mérnöki konzisztenciát és a kiadási megbízhatóságot. Erős fókusz az evidencián alapuló refaktorálásra, CI-minőségi szabványokra és fenntartható, rendszerszintű frontend alapok kiépítésére.",

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
              "Többszerepkörös vállalati platformot építettem valós idejű munkafolyamat- és készletkövetéssel (gyártás, iroda, vezető, partner)",
              "Belső Svelte komponenskönyvtárat terveztem és valósítottam meg platformszinten",
              "Napi e-mail riportrendszert fejlesztettem; hozzájárultam az Express backendhez (SQL tervezés és optimalizálás)",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Nyersanyag- és megfelelőségkövetési rendszer",
            bullets: [
              "Kiadási ciklust haviról kéthetire csökkentettem (cél: heti) Claude-alapú AI-asszisztált toolinggal",
              "CI pipeline-t építettem automatizált quality gate-ekkel; tesztlefedettséget nulláról hoztam létre, csökkentve a produkciós hibákat",
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
          "Frontend fejlesztőként dolgoztam a Scoliánál, egy acélhegyű darts valós idejű automatikus pontszámláló megoldásánál:",
        bullets: [
          "Reszponzív, dinamikus UI-okat építettem a dizájn csapattal együttműködve.",
          "Interaktív vizualizációkat hoztam létre valós idejű haladáskövetéshez és teljesítmény-elemzéshez.",
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
          "Full-stack webes alkalmazásokat szállítottam egyáni vállalkozó fejlesztőként különböző iparágak ügyfelei számára. Rendszertervezésre, karbantartható architektúrára és skálázható webes megoldások teljes körű szállítására összpontosítottam.",
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
      'Pro bono ingyenes iskolai informatika és programozási szakkört indítottam és vezetek a pécsi Mátyás Király Utcai Általános Iskolában (2026. február, folyamatban). Teljes tananyagot terveztem. Mentorálásomnak köszönhetően a csapat első helyet szerzett a 2026-os „Hack and Code" versenyen (Radnóti SZKI), és 1. és 3. helyet szerzett a 22. Neumann János Programozási Versenyen.',

    identity: {
      languages: [
        {name: "Magyar", level: "Anyanyelv", comment: null},
        {name: "Német", level: "Felső-középhaladó (B2)", comment: null},
        {name: "Angol", level: "Felső-középhaladó (B2)", comment: null},
      ],
    },
  },
};
