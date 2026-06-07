import { CV_DATA } from './cv-data.js';
import { EN } from './locales/en.js';
import { HU } from './locales/hu.js';
import { DE } from './locales/de.js';
import { FR } from './locales/fr.js';
import { ES } from './locales/es.js';
import { IT } from './locales/it.js';
import { DOT } from './locales/dot.js';
import { KL } from './locales/kl.js';
import { QU } from './locales/qu.js';
import { GOA } from './locales/goa.js';

const LANGS = { en: EN, hu: HU, de: DE, fr: FR, es: ES, it: IT, dot: DOT, kl: KL, qu: QU, goa: GOA };
const STORAGE_KEY = 'cv_lang';

function _detectBrowserLang() {
  const list = (typeof navigator !== 'undefined')
    ? (navigator.languages?.length ? navigator.languages : [navigator.language])
    : [];
  for (const l of list) {
    const code = l.split('-')[0].toLowerCase();
    if (LANGS[code]) return code;
  }
  return 'en';
}

class LocaleManager {
  constructor() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    this._lang = (saved && LANGS[saved]) ? saved : _detectBrowserLang();
  }

  get lang() { return this._lang; }

  setLang(lang) {
    if (!LANGS[lang]) return;
    this._lang = lang;
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
  }

  t(key) {
    return LANGS[this._lang]?.labels?.[key] ?? LANGS.en.labels[key] ?? key;
  }

  getData() {
    const overrides = LANGS[this._lang]?.content;
    if (!overrides) return CV_DATA;
    return _mergeContent(CV_DATA, overrides);
  }
}

function _mergeContent(base, overrides) {
  const result = { ...base };

  if (overrides.summary != null) result.summary = overrides.summary;
  if (overrides.community != null) result.community = overrides.community;

  if (overrides.identity) {
    result.identity = { ...base.identity };
    if (overrides.identity.languages) result.identity.languages = overrides.identity.languages;
  }

  if (overrides.workExperience) {
    result.workExperience = base.workExperience.map(exp => {
      const ov = overrides.workExperience.find(o => o.id === exp.id);
      if (!ov) return exp;
      const merged = { ...exp };
      if (ov.description != null) merged.description = ov.description;
      if (ov.bullets != null) {
        if (Array.isArray(ov.bullets)) {
          merged.bullets = ov.bullets;
        } else if (typeof ov.bullets === 'object') {
          merged.bullets = { ...exp.bullets, ...ov.bullets };
        }
      }
      if (ov.projects && exp.projects) {
        merged.projects = exp.projects.map((p, i) => {
          const op = ov.projects?.[i];
          return op ? { ...p, ...op } : p;
        });
      }
      return merged;
    });
  }

  return result;
}

export const locale = new LocaleManager();
export const AVAILABLE_LANGS = ['en', 'hu', 'de', 'fr', 'es', 'it', 'dot', 'kl', 'qu', 'goa'];
