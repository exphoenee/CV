import { CV_DATA } from '../cv/cv-data.js';

// CV content per language (backup-relevant)
import { EN } from '../cv/locales/en.js';
import { HU } from '../cv/locales/hu.js';
import { DE } from '../cv/locales/de.js';
import { FR } from '../cv/locales/fr.js';
import { ES } from '../cv/locales/es.js';
import { IT } from '../cv/locales/it.js';
import { DOT } from '../cv/locales/dot.js';
import { KL } from '../cv/locales/kl.js';
import { QU } from '../cv/locales/qu.js';
import { GOA } from '../cv/locales/goa.js';
import { ASG } from '../cv/locales/asg.js';
import { YA } from '../cv/locales/ya.js';

// Page UI labels per language (NOT backup-relevant — page-only translations)
import { EN_PAGE } from '../cv/locales/en-page.js';
import { HU_PAGE } from '../cv/locales/hu-page.js';
import { DE_PAGE } from '../cv/locales/de-page.js';
import { FR_PAGE } from '../cv/locales/fr-page.js';
import { ES_PAGE } from '../cv/locales/es-page.js';
import { IT_PAGE } from '../cv/locales/it-page.js';
import { DOT_PAGE } from '../cv/locales/dot-page.js';
import { KL_PAGE } from '../cv/locales/kl-page.js';
import { QU_PAGE } from '../cv/locales/qu-page.js';
import { GOA_PAGE } from '../cv/locales/goa-page.js';
import { ASG_PAGE } from '../cv/locales/asg-page.js';
import { YA_PAGE } from '../cv/locales/ya-page.js';

const CV_CONTENT = {
  en: EN,
  hu: HU,
  de: DE,
  fr: FR,
  es: ES,
  it: IT,
  dot: DOT,
  kl: KL,
  qu: QU,
  goa: GOA,
  asg: ASG,
  ya: YA,
};
const PAGE_LABELS = {
  en: EN_PAGE.labels,
  hu: HU_PAGE.labels,
  de: DE_PAGE.labels,
  fr: FR_PAGE.labels,
  es: ES_PAGE.labels,
  it: IT_PAGE.labels,
  dot: DOT_PAGE.labels,
  kl: KL_PAGE.labels,
  qu: QU_PAGE.labels,
  goa: GOA_PAGE.labels,
  asg: ASG_PAGE.labels,
  ya: YA_PAGE.labels,
};
const STORAGE_KEY = 'cv_lang';

function _detectBrowserLang() {
  const list =
    typeof navigator !== 'undefined'
      ? navigator.languages?.length
        ? navigator.languages
        : [navigator.language]
      : [];
  for (const l of list) {
    const code = l.split('-')[0].toLowerCase();
    if (CV_CONTENT[code]) return code;
  }
  return 'en';
}

class LocaleManager {
  constructor() {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    this._lang = saved && CV_CONTENT[saved] ? saved : _detectBrowserLang();
    if (typeof document !== 'undefined') document.documentElement.dataset.lang = this._lang;
  }

  get lang() {
    return this._lang;
  }

  setLang(lang) {
    if (!CV_CONTENT[lang]) return;
    this._lang = lang;
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
    if (typeof document !== 'undefined') document.documentElement.dataset.lang = lang;
  }

  t(key) {
    return PAGE_LABELS[this._lang]?.[key] ?? PAGE_LABELS.en?.[key] ?? key;
  }

  getData() {
    const overrides = CV_CONTENT[this._lang]?.content;
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
    result.workExperience = base.workExperience.map((exp) => {
      const ov = overrides.workExperience.find((o) => o.id === exp.id);
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
export const AVAILABLE_LANGS = [
  'en',
  'de',
  'es',
  'fr',
  'it',
  'hu',
  'asg',
  'dot',
  'qu',
  'goa',
  'kl',
  'ya',
];
