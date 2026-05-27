import { escHtml } from '../../shared.js';

export function renderHeader(data) {
  const contacts = data.identity.contacts.map(c => {
    if (c.url) {
      return `<div><a target="_blank" href="${escHtml(c.url)}">${escHtml(c.label)}</a></div>`;
    }
    return `<div>${escHtml(c.label)}</div>`;
  }).join('\n');

  return `
    <div class="header">
      <div class="name-container">
        <span class="name">${escHtml(data.identity.name)}</span>
        <div class="header-buttons">
          <button class="hire-btn-plain" id="hire-plain-btn">Hire Me</button>
          <button class="print-btn-plain" id="print-plain-btn" title="Print CV">🖸 Print</button>
        </div>
      </div>
      <div class="deatils-container">
        <div class="roleContacts">
          <div class="role">${escHtml(data.identity.role)}</div>
          <div class="cv-plain-inline-1 contacts">
            ${contacts}
          </div>
        </div>
        <div class="intro">
          ${data.summary}
        </div>
      </div>
    </div>
  `;
}
