import { html } from '../../shared.js';

export function pushStr(push, depth, key, value, comma, comment) {
  var line = html`<span class="k">"${key}"</span><span class="p">: </span
    ><span class="s">"${value}"</span>`;
  if (comma !== false) line += '<span class="p">,</span>';
  if (comment) line += html` <span class="c">// ${comment}</span>`;
  push(depth, line);
}

export function pushBool(push, depth, key, value, comma, comment) {
  var line = html`<span class="k">"${key}"</span><span class="p">: </span
    ><span class="b">${value ? 'true' : 'false'}</span>`;
  if (comma !== false) line += '<span class="p">,</span>';
  if (comment) line += html` <span class="c">// ${comment}</span>`;
  push(depth, line);
}

export function pushNum(push, depth, key, value, comma, comment) {
  var line = html`<span class="k">"${key}"</span><span class="p">: </span
    ><span class="n">${value}</span>`;
  if (comma !== false) line += '<span class="p">,</span>';
  if (comment) line += html` <span class="c">// ${comment}</span>`;
  push(depth, line);
}

export function pushNull(push, depth, key, comma, comment) {
  var line = html`<span class="k">"${key}"</span><span class="p">: </span
    ><span class="nl">null</span>`;
  if (comma !== false) line += '<span class="p">,</span>';
  if (comment) line += html` <span class="c">// ${comment}</span>`;
  push(depth, line);
}

export function pushStringArray(push, depth, items, lastComma) {
  push(depth, '<span class="p">[</span>');
  items.forEach(function (item, idx) {
    var line = html`<span class="s">"${item}"</span>`;
    if (idx < items.length - 1) line += '<span class="p">,</span>';
    push(depth + 1, line);
  });
  push(depth, lastComma !== false ? '<span class="p">],</span>' : '<span class="p">]</span>');
}
