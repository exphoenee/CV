import { html, raw } from '../../shared.js';
import { locale } from '../../locale.js';
import { renderLangSwitcher } from './lang-switcher.js';

export function renderHeader(data) {
  const contacts = data.identity.contacts.map(c =>
    c.url
      ? html`<div><a target="_blank" href="${c.url}">${c.label}</a></div>`
      : html`<div>${c.label}</div>`
  ).join('\n');

  return html`
    <header class="header" role="banner">
      <div class="name-container">
        <span class="name" role="heading" aria-level="1">${data.identity.name}</span>
        <div class="header-buttons" role="group" aria-label="CV actions">
          ${raw(renderLangSwitcher())}
          <button class="hire-btn-plain" id="hire-plain-btn" aria-label="${locale.t('hireMe')} — open contact form">${locale.t('hireMe')}</button>
          <button class="book-btn-plain" id="plain-booking-btn" title="Book a Meeting" aria-label="Book a meeting with Viktor"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i></button>
          <button class="print-btn-plain" id="print-plain-btn" title="${locale.t('print')}" aria-label="${locale.t('print')} CV"><i class="fa-solid fa-print" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="deatils-container">
        <div class="roleContacts">
          <div class="role">${data.identity.role}</div>
          <nav class="cv-plain-inline-1 contacts" aria-label="Contact information">
            ${raw(contacts)}
          </nav>
        </div>
        <div class="intro" role="region" aria-label="Professional summary">
          ${raw(data.summary)}
        </div>
      </div>
    </header>
  `;
}
