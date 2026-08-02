import { escHtml } from '../../shared.js';
import { PORTFOLIO_URL } from '../../config.js';
import { swgGet } from './ui/endpoint-block.js';
import { swgTagSection } from './ui/tag-section.js';
import { renderIdentitySection } from './sections/identity.js';
import { renderWorkExperienceSection } from './sections/work-experience.js';
import { renderEducationSection } from './sections/education.js';
import { renderSkillsSection } from './sections/skills.js';
import { renderCommunitySection } from './sections/community.js';
import { renderHobbyProjectsSection } from './sections/hobby-projects.js';
import { renderMetaSection } from './sections/meta.js';

export function renderSwaggerContent(data) {
  var E = escHtml;
  var parts = [];

  parts.push('<section class="swagger-ui swagger-container">');
  parts.push(
    '<div class="topbar"><div class="topbar-wrapper"><a class="cv-inline-0 link"><img src="assets/images/swagger.svg" height="36" alt="Swagger" /><span class="cv-inline-1"><span class="cv-inline-2">viktor</span><span class="cv-inline-3">bozzay</span></span></a><button class="theme-toggle" id="theme-toggle" title="Toggle dark mode"><svg class="light-icon" viewBox="0 0 24 24" height="22"><path d="M12 2C9.76 2 7.78 3.05 6.5 4.68l9.81 9.82C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4 2 5.27 5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zM9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z"/></svg><svg class="dark-icon" viewBox="0 0 24 24" height="22"><path d="M12 2C9.76 2 7.78 3.05 6.5 4.68l9.81 9.82C17.94 13.21 19 11.24 19 9a7 7 0 0 0-7-7M3.28 4 2 5.27 5.04 8.3C5 8.53 5 8.76 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h5.73l4 4L20 20.72zM9 20v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z"/></svg></button><form class="cv-inline-4 download-url-wrapper"><label class="cv-inline-5 select-label"><span>Endpoint</span><div class="cv-inline-5 servers"><label class="cv-inline-5"><select class="cv-inline-5"><option>https://bozzayviktor.hu/cv/api - Viktor Bozzay CV API v' +
      E(data.meta.version) +
      '</option></select></label></div></label></form></div></div>',
  );

  parts.push(
    '<div class="information-container wrapper"><section class="block col-12"><div><div class="info"><hgroup class="main"><h1 class="title">' +
      E(data.identity.name) +
      ' - Curriculum Vitae API<span><small><pre class="version">' +
      E(data.meta.version) +
      ' </pre></small><small class="version-stamp"><pre class="version">REST</pre></small></span></h1></hgroup><div class="description"><div class="renderedMarkdown"><p>' +
      data.summary +
      '</p><p>',
  );

  var visibleContacts = data.identity.contacts.filter(function (c) {
    if (!c.url) return true;
    if (c.url.indexOf('mailto:') === 0) return false;
    if (c.label.indexOf('bozzayviktor') > -1) return false;
    return true;
  });
  visibleContacts.forEach(function (c, i) {
    if (i > 0) parts.push('&nbsp;·&nbsp; ');
    if (c.url) {
      parts.push('<a href="' + E(c.url) + '" target="_blank">' + E(c.label) + '</a>');
    } else {
      parts.push(E(c.label));
    }
  });
  parts.push(
    '&nbsp;·&nbsp; <a href="' +
      E(PORTFOLIO_URL) +
      '" target="_blank" rel="noopener noreferrer">Portfolió</a>',
  );

  parts.push('</p></div></div></div></div></section></div>');

  parts.push(
    '<div class="scheme-container"><section class="schemes wrapper block col-12"><div class="schemes-server-container"><div><span class="servers-title">Location</span><div class="servers"><label><select><option>' +
      E(data.identity.location) +
      ' - open to remote / hybrid</option></select></label></div></div></div><div class="auth-wrapper"><button class="btn meet-swagger-btn" id="meet-swagger-btn"><span>Meet</span><i class="fa-regular fa-calendar-check"></i></button><button class="btn authorize locked" id="hire-btn"><span>Hire</span><svg class="lock-icon" viewBox="0 0 20 20" width="20" height="20"><path d="M15.8 8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"/><path class="lock-shackle" d="M14 8V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8h2z"/></svg></button></div></section></div>',
  );

  parts.push(
    '<div class="wrapper"><section class="block col-12 block-desktop col-12-desktop"><div>',
  );

  parts.push(renderIdentitySection(data));

  var summaryResp =
    '<p>' +
    data.summary +
    '</p><p><em>// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)</em></p>';
  parts.push(
    swgTagSection(
      'summary',
      swgGet(
        'summary',
        'get_summary',
        '/summary',
        'Professional overview',
        '<p>Returns the professional summary.</p>',
        null,
        [{ code: '200', bodyHtml: summaryResp, linksHtml: 'No links' }],
      ),
    ),
  );

  parts.push(renderWorkExperienceSection(data));
  parts.push(renderEducationSection(data));
  parts.push(renderSkillsSection(data));
  parts.push(renderCommunitySection(data));
  parts.push(renderHobbyProjectsSection(data));
  parts.push(renderMetaSection(data));

  parts.push('</div></section></div>');
  parts.push('</section>');

  return parts.join('\n');
}
