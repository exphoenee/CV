import { svgArrowDown } from './icons.js';

export function swgTagSection(tagName, endpointsHtml) {
  return '<div class="opblock-tag-section is-open" id="operations-tag-' + tagName + '"><h3 class="opblock-tag no-desc"><span>' + tagName + '</span><small></small><button class="expand-operation" title="Collapse operation">' + svgArrowDown + '</button></h3><div class="no-margin"><div class="operation-tag-content">' + endpointsHtml + '</div></div></div>';
}
