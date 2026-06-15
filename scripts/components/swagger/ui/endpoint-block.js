import { swgSummary } from './summary-bar.js';
import { swgParams } from './params-table.js';
import { swgResponses } from './responses.js';

export function swgDesc(html) {
  return (
    '<div class="opblock-description-wrapper"><div class="opblock-description"><div class="renderedMarkdown">' +
    html +
    '</div></div></div>'
  );
}

export function swgGet(tag, id, path, desc, descHtml, paramRows, responseRows) {
  return (
    '<div class="opblock opblock-get" id="operations-' +
    tag +
    '-' +
    id +
    '">' +
    swgSummary('GET', path, desc) +
    '<div class="opblock-body">' +
    swgDesc(descHtml) +
    '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' +
    swgParams(paramRows) +
    '</div>' +
    swgResponses(responseRows) +
    '</div></div>'
  );
}

export function swgPost(tag, id, path, desc, descHtml, paramRows, responseRows) {
  return (
    '<div class="opblock opblock-post" id="operations-' +
    tag +
    '-' +
    id +
    '">' +
    swgSummary('POST', path, desc) +
    '<div class="opblock-body">' +
    swgDesc(descHtml) +
    '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' +
    swgParams(paramRows) +
    '</div>' +
    swgResponses(responseRows) +
    '</div></div>'
  );
}

export function swgPut(tag, id, path, desc, descHtml, paramRows, responseRows) {
  return (
    '<div class="opblock opblock-put" id="operations-' +
    tag +
    '-' +
    id +
    '">' +
    swgSummary('PUT', path, desc) +
    '<div class="opblock-body">' +
    swgDesc(descHtml) +
    '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' +
    swgParams(paramRows) +
    '</div>' +
    swgResponses(responseRows) +
    '</div></div>'
  );
}

export function swgPatch(tag, id, path, desc, descHtml, paramRows, responseRows) {
  return (
    '<div class="opblock opblock-patch" id="operations-' +
    tag +
    '-' +
    id +
    '">' +
    swgSummary('PATCH', path, desc) +
    '<div class="opblock-body">' +
    swgDesc(descHtml) +
    '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' +
    swgParams(paramRows) +
    '</div>' +
    swgResponses(responseRows) +
    '</div></div>'
  );
}

export function swgDelete(tag, id, path, desc, descHtml, paramRows, responseRows) {
  return (
    '<div class="opblock opblock-delete" id="operations-' +
    tag +
    '-' +
    id +
    '">' +
    swgSummary('DELETE', path, desc) +
    '<div class="opblock-body">' +
    swgDesc(descHtml) +
    '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' +
    swgParams(paramRows) +
    '</div>' +
    swgResponses(responseRows) +
    '</div></div>'
  );
}
