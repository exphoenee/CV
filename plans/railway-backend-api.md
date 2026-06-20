# Railway Backend API — Terv

**Dátum:** 2026-06-20
**Státusz:** Terv (nem implementált)

---

## 1. Technológiai választás

| Komponens | Választás | Indok |
|---|---|---|
| Framework | **Express.js** | A projekt már vanilla JS, nincs szükség framework váltásra |
| LLM | **OpenAI API** (gpt-4o) **VAGY Claude SDK** (claude-sonnet-4-20250514) | Konfigurálható provider; a skill-ek prompt-logikáját kell LLM hívásokká alakítani |
| Adat | `cv-data.js` + `profile/*.md` + `cv/locales/` | Meglévő fájlstruktúra, csak ki kell olvasni |
| Deployment | **Railway** | Git push → auto-deploy, persistent volume a cv-versions-hez |
| Auth | **API key** (egyszerű) | Egyetlen titkos kulcs a headerben |

---

## 2. Végpontok

```
POST /api/apply-job          — teljes pipeline (HR review → cv-data optimalizálás → fordítás → backup → levél)
POST /api/write-cover-letter — motivációs levél generálás (EN + HU + JD nyelv)
POST /api/hr-review          — HR/ATS elemzés (általános vagy JD-alapú)
POST /api/backup             — verzió snapshot készítése
POST /api/restore            — verzió visszaállítás
GET  /api/versions           — korábbi verziók listázása
GET  /api/health             — egészségellenőrzés
```

---

## 3. Request/Response formátumok

### POST /api/apply-job

```json
// Request:
{
  "jobDescription": "Senior Frontend Engineer at Acme Corp...",
  "coverLetter": true,
  "autoConfirm": false
}

// Response (200):
{
  "status": "ok",
  "matchScore": { "required": 78, "preferred": 65, "overall": 74 },
  "changes": { "summary": true, "bullets": 2, "skillOrder": false },
  "versionFolder": "cv-versions/2026-06-20_acme-corp_senior-frontend-engineer/",
  "coverLetter": "cv-versions/.../cover-letter-en.md",
  "missingKeywords": ["GraphQL", "AWS"],
  "report": "review/2026-06-20_1430_hr-review-senior-frontend-engineer.md"
}
```

### POST /api/write-cover-letter

```json
// Request:
{
  "jobDescription": "Senior Frontend Engineer at Acme Corp...",
  "outputFolder": "letters/2026-06-20_acme-corp_senior-frontend-engineer"
}

// Response (200):
{
  "status": "ok",
  "letters": {
    "en": "letters/.../cover-letter-en.md",
    "hu": "letters/.../cover-letter-hu.md",
    "de": "letters/.../cover-letter-de.md"
  },
  "position": "Senior Frontend Engineer @ Acme Corp"
}
```

### POST /api/hr-review

```json
// Request (JD-alapú):
{
  "jobDescription": "Senior Frontend Engineer at Acme Corp..."
}

// Request (általános):
{
  "jobDescription": null
}

// Response (200):
{
  "status": "ok",
  "mode": "jd",
  "scores": { "required": 78, "preferred": 65, "overall": 74 },
  "summary": "Javasolt összefoglaló szöveg...",
  "missingKeywords": ["GraphQL"],
  "phrasingSuggestions": [...],
  "reportFile": "review/2026-06-20_1430_hr-review-senior-frontend-engineer.md"
}
```

### POST /api/backup

```json
// Request:
{
  "label": "manual backup"
}

// Response (200):
{
  "status": "ok",
  "versionFolder": "cv-versions/2026-06-20_1430_manual/"
}
```

### POST /api/restore

```json
// Request:
{
  "versionFolder": "cv-versions/2026-06-20_acme-corp_senior-frontend-engineer/"
}

// Response (200):
{
  "status": "ok",
  "restored": ["cv-data.js", "hu.js", "de.js", "..."]
}
```

### GET /api/versions

```json
// Response (200):
{
  "versions": [
    {
      "folder": "2026-06-20_acme-corp_senior-frontend-engineer",
      "date": "2026-06-20",
      "jobTitle": "Senior Frontend Engineer",
      "company": "Acme Corp",
      "matchScore": 74
    }
  ]
}
```

### GET /api/health

```json
// Response (200):
{
  "status": "ok",
  "version": "1.0.0",
  "cvVersion": "4.2.0",
  "uptime": 12345
}
```

---

## 4. Projekt struktúra

```
api/
├── server.js              — Express app, port, middleware, route mounting
├── routes/
│   ├── apply-job.js       — POST /api/apply-job handler
│   ├── cover-letter.js    — POST /api/write-cover-letter handler
│   ├── hr-review.js       — POST /api/hr-review handler
│   ├── backup.js          — POST /api/backup + POST /api/restore handler
│   └── versions.js        — GET /api/versions handler
├── lib/
│   ├── llm.js             — LLM abstraction layer (OpenAI + Claude, provider switch via env)
│   ├── cv-parser.js       — cv-data.js kiolvasása, strukturált adat építése
│   ├── profile-loader.js  — profile/*.md YAML frontmatter parsing + relevancia szűrés
│   ├── jd-parser.js       — JD szöveg kiértékelése (LLM hívás: követelmények, felelősségek)
│   ├── matcher.js         — ATS kulcsszó egyeztetés, scoring (szinkron, nem kell LLM)
│   ├── rewriter.js        — cv-data.js módosítás (summary átrendezés, bullet átfogalmazás)
│   ├── translator.js      — Locale fájlok frissítése (valós + fikciós nyelvek batch translate)
│   ├── backup.js          — Verzió snapshot készítés (cv-backup agent logika)
│   └── auth.js            — API key middleware
├── prompts/
│   ├── hr-analysis.txt    — HR/ATS elemzés prompt (JD parse + keyword coverage)
│   ├── cover-letter.txt   — Motivációs levél prompt (evidence map → levél)
│   ├── rephrase-bullets.txt — Bullet átfogalmazás prompt
│   └── translate.txt      — Locale fordítás prompt (valós + fikciós nyelvek)
├── package.json           — express, openai, @anthropic-ai/sdk, gray-matter, dotenv
└── .env.example           — LLM_PROVIDER, OPENAI_API_KEY, ANTHROPIC_API_KEY, API_SECRET
```

Railway konfig (projekt root):
```
railway.json              — build + deploy config
```

---

## 5. Mi kerül át a skill-ekből / agent-ekből

| Meglévő skill/agent | API megfelelő | Mit vesz át |
|---|---|---|
| `job-apply-orchestrator` | `routes/apply-job.js` | Teljes lépéssor: JD parse → HR analysis → scoring → cv-data módosítás → fordítás → backup → naplózás |
| `cover-letter-agent` | `routes/cover-letter.js` | EVIDENCE map építés, levélírás (EN/HU/JD nyelv) |
| `hr-review` | `routes/hr-review.js` | Keyword coverage, match scoring, bullet relevance, javaslatok |
| `cv-backup-agent` | `lib/backup.js` | Snapshot készítés, version conflict kezelés |
| `cv-translator-agent` | `lib/translator.js` | Locale frissítés, hossz-korlát ellenőrzés |
| `cv-parser.js` | `lib/cv-parser.js` | `CV_DATA` kiolvasása és strukturálása |
| `jd-parser.js` | `lib/jd-parser.js` | JD szöveg feldolgozás (LLM hívás) |

---

## 6. Amit NEM kell átvenni

- **`cv-improver`** — manuális alkalmazás, nem API-szerű
- **`locale-check`** — fejlesztői eszköz, nem végpont
- **`code-review`** / **`arch-review`** — kódellenőrzés, nem CV tartalom
- **`language-reviewer`** — minőség-ellenőrzés, opcionális kiegészítő
- **`skill-creator`** / **`plugin-creator`** / **`skill-installer`** — Codex plugin rendszer
- **Interaktív megerősítések** — Step 4 a job-apply-ban (`autoConfirm` flaggel kezelhető)

---

## 7. Környezeti változók (Railway)

```env
LLM_PROVIDER=openai            # "openai" VAGY "claude" — melyik LLM backend
OPENAI_API_KEY=sk-...          # OpenAI API kulcs (ha LLM_PROVIDER=openai)
ANTHROPIC_API_KEY=sk-ant-...   # Anthropic API kulcs (ha LLM_PROVIDER=claude)
LLM_MODEL=gpt-4o               # OpenAI modell név (ha LLM_PROVIDER=openai)
# LLM_MODEL=claude-sonnet-4-20250514  # Claude modell név (ha LLM_PROVIDER=claude)
API_SECRET=...                 # Auth token (egyszerű Bearer token)
NODE_ENV=production
PORT=3000
CV_PROJECT_ROOT=../            # a CV fájlok elérési útja a Railway volume-on
```

---

## 8. Implementációs lépések

1. **`api/package.json`** — függőségek (express, openai, @anthropic-ai/sdk, gray-matter, dotenv)
2. **`api/server.js`** — Express app + auth middleware + CORS + route mounting
3. **`api/lib/auth.js`** — API key ellenőrző middleware
4. **`api/lib/cv-parser.js`** — cv-data.js importálása és strukturálása
5. **`api/lib/profile-loader.js`** — YAML frontmatter parsing + relevancia szűrés
6. **`api/lib/jd-parser.js`** — LLM prompt: JD szöveg → strukturált követelmények
7. **`api/lib/matcher.js`** — Kulcsszó egyeztetés, scoring (szinkron logika)
8. **`api/lib/rewriter.js`** — LLM prompt: cv-data.js módosítások generálása
9. **`api/lib/translator.js`** — Locale fájlok frissítése (batch translate prompt)
10. **`api/lib/backup.js`** — Snapshot logika (cv-backup agent-ból)
11. **`api/lib/llm.js`** — LLM abstraction layer (OpenAI + Claude provider switch)
12. **`api/routes/*.js`** — Végpont handler-ek
13. **`api/prompts/*.txt`** — Prompt sablonok (skill markdown → LLM prompt)
14. **`railway.json`** — Deployment konfiguráció

---

## 9. LLM Abstraction Layer — `api/lib/llm.js`

A rendszer úgy van tervezve, hogy **provider-független** legyen. Egyetlen `llm.js` modul kezeli mindkét API-t, a váltás csak környezeti változó kérdése.

### Architektúra

```
llm.js
├── OpenAIClient    — openai csomag használata
├── ClaudeClient    — @anthropic-ai/sdk csomag használata
└── createLLM()     — factory függvény: LLM_PROVIDER alapján visszaadja a megfelelő klienst
```

### Egységes API

```js
// Minden hívás ugyanúgy néz ki, függetlenül a providertől:
const llm = createLLM();  // automatikusan OpenAI vagy Claude

const result = await llm.complete({
  system: "Te egy HR szakértő vagy...",      // system prompt
  prompt: "Elemezd az alábbi JD-t:...",       // user prompt
  model: "gpt-4o",                            // opcionális, alapértelmezett a provider defaultja
  temperature: 0.7,
  maxTokens: 4096,
  responseFormat: "json"                      // "text" | "json" — Claude-nál native JSON mode
});

// Visszatérési érték egységes:
// { content: "string", usage: { promptTokens, completionTokens } }
```

### Provider-specifikus különbségek kezelése

| Tulajdonság | OpenAI | Claude |
|---|---|---|
| SDK csomag | `openai` | `@anthropic-ai/sdk` |
| System prompt | `messages[0].role = "system"` | `system` külön paraméter |
| JSON mode | `response_format: { type: "json_object" }` | `model: "claude-..."` + promptban kérni |
| Streaming | `stream: true` | `stream: true` |
| Max tokens | `max_tokens` | `max_tokens` (kötelező!) |
| Hiba kezelés | `error.status === 429` | `error.status === 429` |
| Rate limit | `x-ratelimit-*` header-ek | `retry-after` header |

### Provider váltás

```
LLM_PROVIDER=openai  → OpenAI-t használ (alapértelmezett)
LLM_PROVIDER=claude  → Claude-t használ
```

Ha `LLM_PROVIDER` nincs beállítva, alapértelmezett: `openai`.

### Előnyök

- **Egyetlen prompt sablon** — nem kell külön prompt fájl Minden providerhez
- **Egyszerű váltás** — csak env változó, újra deploy nélkül is (Railway env update)
- **Költség optimalizálás** — egyes feladatok olcsóbbak OpenAI-nál, mások Claude-nál
- **Fallback** — ha az egyik provider elérhetetlen, át lehet váltani a másikra

---

## 10. Limitációk / kompromisszumok

- **Nincs valós idejű interaktivitás** — a jelenlegi skill-ek lépésenként kérnek megerősítést. Az API-nál ezt `autoConfirm` flaggel oldjuk meg
- **LLM költség** — minden `/apply-job` hívás ~5-10 LLM API hívást generál; költségoptimalizálás érdekében bizonyos lépésekben (matcher, scoring) szinkron logika helyettesíti az LLM hívást
- **cv-data.js írás** — a backend módosítja a live `cv-data.js`-t. Egyszerre több request race condition-t okozhat → file lock vagy request queue kell
- **Fikciós nyelvek** — a 6 fikciós nyelv (asg, dot, kl, qu, goa, ya) fordítása nem standard LLM feladat, prompt sablonokkal oldható meg
- **Persistent volume** — a Railway-en a `cv-versions/` és `letters/` mappáknak persistent volume kell, különben deploykor törlődnek
- **Auth** — egyszerű Bearer token, nem OAuth. Egyéni használatra elég, de nyilvános API-hoz nem ajánlott

---

## 11. railway.json sablon

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd api && npm install"
  },
  "deploy": {
    "startCommand": "cd api && node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```
