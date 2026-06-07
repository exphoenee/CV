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
    <div class="header">
      <div class="name-container">
        <span class="name">${data.identity.name}</span>
        <div class="header-buttons">
          ${raw(renderLangSwitcher())}
          <button class="hire-btn-plain" id="hire-plain-btn">${locale.t('hireMe')}</button>
          <button class="print-btn-plain" id="print-plain-btn" title="${locale.t('print')}"><i class="fa-solid fa-print"></i></button>
        </div>
      </div>
      <div class="deatils-container">
        <div class="roleContacts">
          <div class="role">${data.identity.role}</div>
          <div class="cv-plain-inline-1 contacts">
            ${raw(contacts)}
          </div>
        </div>
        <div class="intro">
          ${raw(data.summary)}
        </div>
      </div>
    </div>
  `;
}
