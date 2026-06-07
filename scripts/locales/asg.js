export const ASG = {
  labels: {
    cvOf: "Lífsrit:",
    roleLocation: "Framhlið Tæknileiðtogi · Miðgarðr · Pécs, HU",
    chooseView: "Hvat kýss þú? Sjá lífsrit:",
    btnReadingLabel: "Ek les lífsrit",
    btnReadingDesc: "Hreinligt, lesanlegt, prentsætt",
    btnFrontendLabel: "Ek em framhlið smiðr",
    btnFrontendDesc: "Swagger API skjöl",
    btnBackendLabel: "Ek em bakhlið smiðr",
    btnBackendDesc: "JSON / VS Code sýn",
    btnGamerLabel: "Ek em leikmaðr",
    btnGamerDesc: "Gagnvirkt 2.5D RPG heim",
    btnHireLabel: "Ráð mik!",
    btnHireDesc: "Senda mér boð",
    workExperience: "Starfsferill",
    education: "Menntun",
    languages: "Tungumál",
    programmingLanguages: "Forritunarmál",
    hobbyProjects: "Áhugamálsverkefni",
    community: "Félag & Leiðsögn",
    references: "Meðmæli:",
    hireMe: "Ráð mik!",
    print: "Prenta",
    poweredBy: "Smíðað með",
    current: "nú",
    contactTitle: "Hafa samband við Viktor",
    yourName: "Nafn þitt",
    namePlaceholder: "Leifr Eiríksson",
    yourEmail: "Tölvupóstur þinn",
    emailPlaceholder: "þinn@heim.is",
    message: "Boð",
    messagePlaceholder: "Heilir Viktor, vér viljum...",
    send: "Senda",
    messageSent: "Boð sent. Vel gert.",
    close: "Loka",
    themeChanged: "Litfar:",
    musicChangedTo: "Tónlist:",
    musicPaused: "í bið",
    musicPlaying: "spilar",
    nowPlaying: "Nú spilar:",
    repeatNone: "Engin endurtekning",
    repeatAll: "Endurtaka allt",
    repeatOne: "Endurtaka eitt",
  },
  content: {
    summary:
      "Ek em framhlið smiðr, kunnáttr í kerfissmíð ok stórum endursmíðum gamalla kerfa. Ek hef leiðt fulla endursmíð stórra stofnanakerfa til nýrra staflana ok bætt viðhaldshæfni þeirra. Ek hef innleitt AI-meðliðsverklag er mjök aukið hefr afköst, samkvæmni ok áreiðanleika útgáfna. Ek legg áherslu á sannanlegataktar endurbætur, CI-gæðastaðla ok sjálfbæran framhlíðargrunn.",

    workExperience: [
      {
        id: "aegex",
        description:
          "Ek leiðti kerfislegar endurbyggingar tveggja stórra stofnanakerfa. Ek ræð yfir allri afhendingu SafeSy ok FACTS — kerfissmíð, framhlíðarbygging ok bakhlíðarsamtengingu. Ek innleiddi AI-meðliðsverklag ok CI-gæðapipar, er gert hefr sannanlegataktar smíðiferli mögulegt ok aukið afhendingarhraða ok áreiðanleika útgáfna.",
        bullets: [
          "Ek átti smíð ok afhendingu tveggja stofnanakerfa (SafeSy, FACTS) frá hönnun til framleiðslu",
          "Ek leiðti endursmíð gamalla kerfa með fullum endursmíðum til nýrra framhlíðarstafla",
          "Ek innleiddi AI-meðliðsverklag er aukið hefr afköst ok samkvæmni",
          "Ek innleiddi CI-pipar með sjálfvirkum gæðahlíðum ok prófunaráætlun frá grunni",
          "Ek stofnaði sannanlegataktar endurbætunarferli með mælanlegum gæðaframförum",
          "Ek þjálfa ok leiði einn miðstigsverkfræðing nú",
        ],
        projects: [
          {
            name: "SafeSy",
            subtitle: "Innra framleiðslustjórnunarkerfi",
            bullets: [
              "Ek smíðaði þverhlutverk stofnanavettvang fyrir framleiðslu, skrifstofur, forstjóra ok félaga — með rauntímaverkflæðis- ok birgðarakningu",
              "Ek hannaði ok innleiddi endurnýtanlegt innra Svelte-íhlutasafn notað um alla vettvanginn",
              "Ek þróaði dagleg tölvupóstskýrslukerfi ok lagði til Express bakhlíðarinnar — þ.m.t. SQL-fyrirspurnarhönnun ok bestun",
            ],
          },
          {
            name: "FACTS",
            subtitle: "Hráefnis- ok fylgnirakninga kerfi",
            bullets: [
              "Ek minnkaði útgáfuhringinn frá mánaðarlegum í annars viku (markmið: vikulegur) — með AI-meðliðsverklag (Claude-smíð)",
              "Ek innleiddi CI-pipar með sjálfvirkum gæðahlíðum — ek stofnaði prófunarskyld frá núlli ok minnkaði framleiðsluvandamál verulega",
              "Ek flutti smíðina yfir í PNPM monorepo ok dró út samnýtta FACTS/Driver pakkann til endurnotkunar",
              "Ek smíðaði innri CLI-verkfæri fyrir monorepo verkflæðisjálfvirkni ok framleiðni þróara",
            ],
          },
        ],
      },
      {
        id: "telekom",
        description:
          "Ek vann í stóru Agile-fyrirtæki á AI-samþætt framhlíðarkerfi, með áherslu á rauntímagagnasýningu ok framhlíð-bakhlíð samþættingu. Ek smíðaði týpuöruggar notendaviðmótsíhlutir ok lagði til AI-drifnar prófunarverkflæðis ok greiningaviðmótsins.",
        bullets: [
          "Ek þróaði týpuöruggar React-notendaviðmótsíhlutir fyrir stofnana AI-samþætt kerfi",
          "Ek samþætti framhlíðarviðmót við AI-drifnar bakhlíðarþjónustur með API verkflæðum",
          "Ek smíðaði rauntímagagnasýningaviðmót fyrir prófunarniðurstöður ok kerfisgreiningu",
          "Ek vann í Agile afhendingumhverfi með stöðugri samþættingu framhlíðar- ok bakhlíðarkerfa",
        ],
      },
      {
        id: "scolia",
        description:
          "Ek þróaði rauntímaframhlíðarviðmót fyrir sjálfvirkan íþróttastigsgjafar- ok greiningar vettvang. Ek lagði áherslu á lágseinkun notendaviðmótsuppfærslur, lifsgagnasýningu ok svarlægt notendaupplifun í háttíðni gagnaumhverfi.",
        bullets: [
          "Ek smíðaði rauntíma React-notendaviðmót fyrir lifandi íþróttastiggjöf ok leikrakningu",
          "Ek innleiddi lágseinkun gagnasýningaíhlutir fyrir lifandi frammistöðugreiningu",
          "Ek samþætti WebSocket-rauntímagagnastraumar í framhlíðarsmíðina",
          "Ek vann með hönnunar- ok bakhlíðarsveitum að afhenda svarlæg, háframmistöðu notendaviðmótskerfi",
        ],
      },
      {
        id: "cubicfox",
        description:
          "Ek afhenti framleiðslugæða framhlíðarforrit fyrir alþjóðlega viðskiptavini í Agile-umhverfi. Ek lagði áherslu á sveigjanleika notendaviðmótssmíðar, framhlíðarstaðla ok bætta kröfuskýrni milli hagsmunaaðila ok þróunarsveitanna.",
        bullets: [
          "Ek smíðaði framleiðslutilbúin React ok Next.js framhlíðarforrit fyrir alþjóðlega viðskiptavini",
          "Ek bætti samkvæmni framhlíðarsmíðar með því að skilgreina ok framfylgja kóðastaðlum yfir sveitina",
          "Ek endurhannað kröfuöflunarlegt ferli, minnkað tvíræðni ok ítrekunarhringa",
          "Ek vann með hönnunar- ok bakhlíðarsveitum að afhenda sveigjanleg, fjölvafrasam notendaviðmótskerfi",
        ],
      },
      {
        id: "cobotx",
        description:
          "Ek leiðti verkfræðilegar verkefni í iðnaðarvinnslu ok sjálfvirkni, brúaði vélverkfræði, PLC-kerfi ok hugbúnaðardrifna sjálfvirkni. Ek bar ábyrgð á kerfisskilgreiningu, liðsforystun ok afhendingaáætlun í framleiðslulýðræðisumhverfi.",
        bullets: [
          "Ek þróaði vélbúnaðar- ok hugbúnaðarskilgreiningar fyrir PLC-tengd vélmenni ok sjálfvirknikerfi",
          "Ek skilgreindi tæknikröfur ok gerði hagkvæmnisrannsóknir fyrir iðnaðarvélmannaðlausnir",
          "Ek smíðaði ok leiðti sveit 4 verkfræðinga — eftirliti yfir afhendingu, frammistöðu ok verkframkvæmd",
          "Ek stofnaði KPI, skjalastaðla ok skýrsluferli fyrir verkfræðilegar aðgerðir",
          "Ek bjó til getu- ok fjárhagsáætlanir sem samræmast sölu- ok framleiðsluspám",
        ],
      },
      {
        id: "webforsol",
        description:
          "Ek afhenti full-stack vefforrit sem sjálfstæður smiðr fyrir viðskiptavini í mörgum greinum. Ek lagði áherslu á kerfishönnun, viðhaldanlega smíð ok heildarlegar afhendingar á sveigjanlegum vefslausnum.",
        bullets: [
          "Ek smíðaði full-stack forrit með React, Next.js, Node.js, PHP ok tengdum ok ótengdum gagnagrunnum",
          "Ek hannaði ok innleiddi REST API ok einingalegar bakhlíðarsmíðar fyrir viðskiptavinakerfi",
          "Ek afhenti heildarlegar vöruvöxt frá kröfugreiningu til uppsetningar ok viðhalds",
          "Ek vann beint með viðskiptavinum að þýða viðskiptaþarfir í tæknilegar sveigjanleikalausnir",
          "Ek bætti forritasmíð fyrir viðhaldanleika, sveigjanleika ok langtíma uppbyggingu",
        ],
      },
    ],

    community:
      "Pro bono kennsla ok kóðunarleiðsögn við Mátyás Király framhaldsskóla, Pécs (frá janúar 2026, enn í gangi). Ek leiðti sveit sem þreytti eitt keppni. Sem þreytti meðlimr: eitt lið í „Hack and Code\" 2026 (Radnóti SZKI) ok eitt ok þrjú lið í 22. Neumann János kóðunarmótinu.",

    identity: {
      languages: [
        {name: "Magyar", level: "Móðurmál", comment: null},
        {name: "Deutsch", level: "B2 — góðr", comment: null},
        {name: "English", level: "B2 — gott", comment: null},
      ],
    },
  },
};
