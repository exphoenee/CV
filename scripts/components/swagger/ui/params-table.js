import { escHtml } from '../../../shared.js';

export function swgParams(rows) {
  if (!rows || rows.length === 0) return '<div class="parameters-container"><div class="opblock-description-wrapper"><p>No parameters</p></div></div>';
  var r = '<div class="parameters-container"><div class="table-container"><table class="parameters"><thead><tr><th class="col_header parameters-col_name">Name</th><th class="col_header parameters-col_description">Description</th></tr></thead><tbody>';
  rows.forEach(function (p) {
    r += '<tr><td class="parameters-col_name"><div class="parameter__name">' + escHtml(p.name) + '</div><div class="parameter__type">' + escHtml(p.type) + '</div><div class="parameter__in">' + escHtml(p.loc || "metadata") + '</div></td><td class="parameters-col_description"><div class="renderedMarkdown">' + p.descHtml + '</div></td></tr>';
  });
  r += '</tbody></table></div></div>';
  return r;
}
