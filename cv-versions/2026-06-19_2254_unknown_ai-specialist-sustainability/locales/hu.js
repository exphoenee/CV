export const HU = {
  content: {
    summary:
      'Mérnök és Tech Lead 5+ év szoftverfejlesztési és 13 év ipari mérnöki tapasztalattal, AI-asszisztált fejlesztésre, adatautomatizálásra és rendszertervezésre specializálódva TypeScript, Node.js, Python és SQL technológiákkal. AI-vezérelt fejlesztési munkafolyamatokat vezettem be, és automatizált minőségi kapukkal ellátott CI pipeline-okat építettem. Automatizáltam az adatáramlásokat és a riportálási folyamatokat, napi e-mailes riportrendszereket és valós idejű adatvizualizációs interfészeket építettem, valamint hozzájárultam környezeti megfelelőséget követő platformok fejlesztéséhez. Mérnököket vezetek és mentorálok, az evidenciaalapú, analitikus és strukturált megoldásszállításra fókuszálva a csapatok között.',
    workExperience: [
      {
        id: 'aegex',
        description:
          'A SafeSy és FACTS rendszerek teljes körű architektúrális modernizációját vezettem — a rendszertervezéstől az éles üzemig. AI-asszisztált fejlesztési folyamatokat és CI-vezérelt minőségi pipeline-okat honosítottam meg, amelyek evidenciaalapú mérnöki kultúrát teremtettek és jelentősen növelték a szállítási sebességet és a kiadási megbízhatóságot.',
        bullets: [
          'Két vállalati rendszer (SafeSy, FACTS) architektúráját és szállítását vettem a kezembe, a tervezéstől a produkcióig',
          'Legacy rendszerek modernizációját vezettem teljes újraírással és modern frontend stack-re való migrációval',
          'AI-asszisztált fejlesztési munkafolyamatokat vezettem be, növelve a mérnöki teljesítményt és konzisztenciát',
          'CI pipeline-t implementáltam automatizált minőségi kapukkal és tesztelési stratégiával a semmiből',
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
              'Automatizáltam a riportálási folyamatokat egy feliratkozható napi e-mailes riportrendszerrel, és adatforrásokat integráltam az Express backenden keresztül (SQL lekérdezések tervezése és optimalizálása).',
            ],
          },
          {
            name: 'FACTS',
            subtitle: 'Nyersanyag- és megfelelőségkövetési rendszer',
            bullets: [
              'Kiadási ciklust haviról kéthetire csökkentettem (cél: heti) Claude-alapú AI-asszisztált toolinggal',
              'CI/CD pipeline fejlesztése automatizált quality gate-ekkel; átfogó tesztelési infrastruktúra és tesztlefedettség kiépítése nulláról.',
              'Az architektúrát PNPM monorepóra migráltam, és kiemeltem a megosztott FACTS/Driver csomagot az újrafelhasználáshoz',
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
          'Type-safe React-alapú UI komponenseket fejlesztettem vállalati AI-integrált rendszerekhez',
          'Frontend interfészeket integráltam AI-vezérelt backend szolgáltatásokkal API-n keresztül',
          'Valós idejű adatvizualizációs és dashboard interfészeket építettem a teszteredmények monitorozásához és a rendszerelemzéshez',
          'Agilis fejlesztési környezetben dolgoztam a frontend és backend rendszerek folyamatos integrációjával',
        ],
      },
      {
        id: 'scolia',
        description:
          'Valós idejű frontend interfészeket fejlesztettem egy automatizált sport-pontszámláló és analitikai platformhoz. Az alacsony késleltetésű UI-frissítésekre, az élő adatvizualizációra és a reszponzív élményre fókuszáltam nagy frekvenciájú adatkörnyezetben.',
        bullets: [
          'Valós idejű React-alapú UI-t építettem élő sport-pontszámláláshoz és mérkőzéskövetéshez',
          'Alacsony késleltetésű vizualizációs komponenseket építettem élő analitikához',
          'WebSocket-alapú valós idejű adatfolyamokat integráltam a frontend architektúrába',
          'A dizájn és backend csapatokkal alacsony késleltetésű valós idejű UI-t szállítottam élő adat alatt',
        ],
      },
      {
        id: 'cubicfox',
        description:
          'Production ready frontend alkalmazásokat szállítottam nemzetközi ügyfeleknek agilis környezetben. Skálázható UI-architektúrára, frontend szabványokra és a stakeholderek közötti igénytisztázás javítására fókuszáltam.',
        bullets: [
          'Production ready React és Next.js alkalmazásokat fejlesztettem nemzetközi ügyfelek számára',
          'Javítottam a frontend architektúra konzisztenciáját kódszabványok bevezetésével a csapatban',
          'Újraterveztem az igény-összegyűjtési folyamatot, csökkentve a félreérthetőséget és az iterációkat',
          'Együttműködtem a dizájn és backend csapatokkal skálázható, böngészőfüggetlen UI szállításáért',
        ],
      },
      {
        id: 'cobotx',
        description:
          'Ipari robotikai és automatizálási mérnöki projekteket vezettem, összekötve a gépészmérnöki, PLC-rendszer és szoftveralapú automatizálási szaktudást. Felelős voltam a rendszerspecifikációért, csapatvezetésért és szállítástervezésért termelés-kritikus környezetekben.',
        bullets: [
          'Hardver- és szoftverspecifikációkat fejlesztettem PLC-alapú robotikai és automatizálási rendszerekhez',
          'Műszaki követelményeket és megvalósíthatósági tanulmányokat definiáltam ipari robotmegoldásokhoz',
          '4 fős mérnökcsapatot építettem és vezettem, felügyelve a szállítást',
          'KPI-okat, dokumentációs szabványokat és automatizált riportálási folyamatokat hoztam létre a mérnöki tevékenységekhez',
          'Kapacitás- és pénzügyi terveket készítettem az értékesítési és gyártási előrejelzésekhez',
        ],
      },
      {
        id: 'webforsol',
        description:
          'Full-stack webes alkalmazásokat szállítottam egyéni vállalkozóként különböző iparágak ügyfeleinek. Rendszertervezésre, karbantartható architektúrára és skálázható megoldások teljes körű szállítására fókuszáltam.',
        bullets: [
          'Full-stack alkalmazásokat építettem React, Next.js, Node.js, PHP és relációs/nem relációs adatbázisokkal',
          'REST API-okat és moduláris backend architektúrákat terveztem kliens rendszerekhez',
          'Teljes körű termékfejlesztést végeztem az igényelemzéstől az üzembe helyezésig',
          'Közvetlenül ügyfelekkel dolgoztam az üzleti igények technikai megoldásokra fordításáért',
          'Optimalizáltam az alkalmazás struktúráját a karbantarthatóság és hosszú távú skálázhatóság érdekében',
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
