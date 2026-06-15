export function swgResponses(rows) {
  var r =
    '<div class="responses-wrapper"><div class="opblock-section-header"><h4>Responses</h4></div><div class="responses-inner"><table class="responses-table" aria-live="polite" role="region"><thead><tr class="responses-header"><td class="col_header response-col_status">Code</td><td class="col_header response-col_description">Description</td><td class="col_header response-col_links">Links</td></tr></thead><tbody>';
  rows.forEach(function (row) {
    r +=
      '<tr class="response"><td class="response-col_status">' +
      row.code +
      '</td><td class="response-col_description"><div class="renderedMarkdown">' +
      row.bodyHtml +
      '</div><section class="response-controls"><div class="response-control-media-type response-control-media-type--accept-controller"><small class="response-control-media-type__title">Media type</small><div class="content-type-wrapper"><select aria-label="Media Type" class="content-type"><option value="application/json">application/json</option></select></div><small class="response-control-media-type__accept-message">Controls <code>Accept</code>header.</small></div></section></td><td class="response-col_links">' +
      (row.linksHtml || 'No links') +
      '</td></tr>';
  });
  r += '</tbody></table></div></div>';
  return r;
}
