import { escHtml } from '../../shared.js';

export function jesc(str) {
  return String(str).replace(/"/g, '\\"');
}

export function pushStr(push, depth, key, value, comma, comment) {
  var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="s">"' + escHtml(value) + '"</span>';
  if (comma !== false) h += '<span class="p">,</span>';
  if (comment) h += '  <span class="c">// ' + comment + '</span>';
  push(depth, h);
}

export function pushBool(push, depth, key, value, comma, comment) {
  var v = value ? 'true' : 'false';
  var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="b">' + v + '</span>';
  if (comma !== false) h += '<span class="p">,</span>';
  if (comment) h += '  <span class="c">// ' + comment + '</span>';
  push(depth, h);
}

export function pushNum(push, depth, key, value, comma, comment) {
  var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="n">' + value + '</span>';
  if (comma !== false) h += '<span class="p">,</span>';
  if (comment) h += '  <span class="c">// ' + comment + '</span>';
  push(depth, h);
}

export function pushNull(push, depth, key, comma, comment) {
  var h = '<span class="k">"' + key + '"</span><span class="p">: </span><span class="nl">null</span>';
  if (comma !== false) h += '<span class="p">,</span>';
  if (comment) h += '  <span class="c">// ' + comment + '</span>';
  push(depth, h);
}

export function pushStringArray(push, depth, items, lastComma) {
  push(depth, '<span class="p">[</span>');
  items.forEach(function (item, idx) {
    var line = '<span class="s">"' + escHtml(item) + '"</span>';
    if (idx < items.length - 1) line += '<span class="p">,</span>';
    push(depth + 1, line);
  });
  if (lastComma !== false) {
    push(depth, '<span class="p">],</span>');
  } else {
    push(depth, '<span class="p">]</span>');
  }
}
