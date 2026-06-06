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
  },
  content: {
    summary:
      "Frontend mérnök, aki frontend architektúrára, rendszertervezésre és nagyszabású legacy rendszerek modernizációjára specializálódott. Vállalati rendszerek teljes újraírását és migrációját vezette modern technológiai stack-ekre, javítva az alapplatformok karbantarthatóságát és skálázhatóságát. AI-asszisztált fejlesztési munkafolyamatokat vezetett be, amelyek jelentősen növelték a szállítási sebességet, a mérnöki konzisztenciát és a kiadási megbízhatóságot. Erős fókusz az evidencián alapuló refaktorálásra, CI-minőségi szabványokra és fenntartható, rendszerszintű frontend alapok kiépítésére.",

    workExperience: [
      {
        id: "aegex",
        description:
          "Két vállalati legacy rendszer teljes körű modernizációját vezette (SafeSy, FACTS) — a rendszertervezéstől a produkcióig. AI-asszisztált és CI-vezérelt mérnöki folyamatokat honosított meg, jelentősen javítva a szállítási sebességet és kiadási megbízhatóságot.",
        bullets: [
          "Két vállalati rendszer (SafeSy, FACTS) architektúráját és szállítását vezette a tervezéstől a produkcióig",
          "Legacy rendszerek modernizációját vezette teljes újraírással és modern frontend stack-re való migrációval",
          "AI-asszisztált fejlesztési munkafolyamatokat vezetett be, növelve a mérnöki teljesítményt és konzisztenciát",
          "CI pipeline-t implementált automatizált minőségi kapukkal és tesztelési stratégiával a semmiből",
          "Evidenciaalapú refaktorálási folyamatot hozott létre mérhető minőségjavulással",
          "Jelenleg 1 mid-level mérnököt mentorál és vezet",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Belső gyártásirányítási rendszer",
            bullets: [
              "Többszerepkörös vállalati platformot épített valós idejű munkafolyamat- és készletkövetéssel (gyártás, iroda, vezető, partner)",
              "Belső Svelte komponenskönyvtárat tervezett és valósított meg platformszinten",
              "Napi e-mail riportrendszert fejlesztett; hozzájárult az Express backendhez (SQL tervezés és optimalizálás)",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Nyersanyag- és megfelelőségkövetési rendszer",
            bullets: [
              "Kiadási ciklust haviról kéthetire csökkentette (cél: heti) Claude-alapú AI-asszisztált toolinggal",
              "CI pipeline-t épített automatizált quality gate-ekkel; tesztkihasználtságot nulláról hozott létre, csökkentve a produkciós hibákat",
              "Architektúrát PNPM monorepo-ra migrálta, megosztott FACTS/Driver csomaggal",
              "Belső CLI toolingot épített monorepo workflow-automatizáláshoz és fejlesztői produktivitáshoz",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Vállalati Agile környezetben dolgozott egy AI-integrált frontend rendszeren, fókuszálva a valós idejű adatvizualizációra és frontend-backend integrációra. Típusbiztos UI komponenseket épített és hozzájárult az AI-vezérelt tesztelési munkafolyamatokhoz és elemzési interfészekhez.",
        bullets: [
          "Típusbiztos React-alapú UI komponenseket fejlesztett vállalati AI-integrált rendszerekhez",
          "Frontend interfészeket integrált AI-vezérelt backend szolgáltatásokkal API munkafolyamatokon keresztül",
          "Valós idejű adatvizualizációs interfészeket épített teszteredményekhez és rendszerelemzéshez",
          "Agile szállítási környezetben dolgozott a frontend és backend rendszerek folyamatos integrációjával",
        ],
      },
      {
        id: "scolia",
        description:
          "Frontend fejlesztőként a Scoliánál, egy acéltollú darts valós idejű automatikus pontozási megoldásánál:",
        bullets: [
          "Reszponzív, dinamikus UI-okat épített a dizájn csapattal együttműködve.",
          "Interaktív vizualizációkat hozott létre valós idejű haladáskövetéshez és teljesítmény-elemzéshez.",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Produkciókész frontend alkalmazásokat szállított nemzetközi ügyfelek számára Agile környezetben. Skálázható UI architektúrára, frontend szabványokra és a stakeholderek és fejlesztési csapatok közötti igénytisztázás javítására összpontosított.",
        bullets: [
          "Produkciókész React és Next.js frontend alkalmazásokat fejlesztett nemzetközi ügyfeleknek",
          "Javította a frontend architektúra konzisztenciáját kódszabványok meghatározásával és érvényesítésével a csapatban",
          "Újratervezte az ügyféligény-összegyűjtési folyamatot, csökkentve a félreérthetőséget és az iterációs köröket",
          "Együttműködött a dizájn és backend csapatokkal skálázható, böngészőfüggetlen UI rendszerek szállításáért",
        ],
      },
      {
        id: "cobotx",
        description:
          "Ipari robotikai és automatizálási mérnöki projekteket vezetett, összekötve a gépészmérnöki, PLC-rendszer és szoftveralapú automatizálási szaktudást. Felelős volt a rendszerspecifikációért, csapatvezetésért és szállítástervezésért termelés-kritikus környezetekben.",
        bullets: [
          "Hardware és software specifikációkat fejlesztett PLC-alapú robotikai és automatizálási rendszerekhez",
          "Műszaki követelményeket és megvalósíthatósági tanulmányokat definiált ipari robotikai megoldásokhoz",
          "4 mérnökből álló csapatot épített fel és vezetett, felügyelte a szállítást, teljesítményt és a projekt végrehajtását",
          "KPI-okat, dokumentációs szabványokat és riportálási folyamatokat hozott létre a mérnöki tevékenységekhez",
          "Kapacitás- és pénzügyi terveket készített az értékesítési és gyártási előrejelzésekhez igazodva",
        ],
      },
      {
        id: "webforsol",
        description:
          "Full-stack webes alkalmazásokat szállított önálló fejlesztőként különböző iparágak ügyfelei számára. Rendszertervezésre, karbantartható architektúrára és skálázható webes megoldások teljes körű szállítására összpontosított.",
        bullets: [
          "Full-stack alkalmazásokat épített React, Next.js, Node.js, PHP és relációs/nem relációs adatbázisok segítségével",
          "REST API-okat és moduláris backend architektúrákat tervezett és valósított meg kliens rendszerekhez",
          "Teljes körű termékfejlesztést végzett az igényelemzéstől az üzembe helyezésig és karbantartásig",
          "Közvetlenül ügyfelekkel dolgozott az üzleti igények skálázható technikai megoldásokra való fordításáért",
          "Optimalizálta az alkalmazás struktúráját a karbantarthatóság, bővíthetőség és hosszú távú skálázhatóság érdekében",
        ],
      },
    ],

    community:
      'Pro bono alapon ingyenes iskolai informatika és programozási szakkört indított és vezet a pécsi Mátyás Király Utcai Általános Iskolában (2026. február, folyamatban). Teljes tananyagot tervezett. Mentorálása alatt a csapat első helyet szerzett a 2026-os „Hack and Code" versenyen (Radnóti SZKI), és 1. és 3. helyet szerzett a 22. Neumann János Programozási Versenyen.',

    identity: {
      languages: [
        { name: "Magyar", level: "Anyanyelv", comment: null },
        { name: "Német", level: "Felső-középhaladó (B2)", comment: null },
        { name: "Angol", level: "Felső-középhaladó (B2)", comment: null },
      ],
    },
  },
};
