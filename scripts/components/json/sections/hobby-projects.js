import { escHtml } from '../../../shared.js';
import { jesc } from '../helpers.js';

export function renderHobbyProjects(data, push) {
  var E = escHtml;

  push(1, '<span class="k">"hobbyProjects"</span><span class="p">: [</span>');
  data.hobbyProjects.forEach(function (proj, hi) {
    var comma = hi < data.hobbyProjects.length - 1;
    var line = '<span class="p">{ </span><span class="k">"name"</span><span class="p">: </span><span class="s">"' + jesc(proj.name) + '"</span><span class="p">, </span><span class="k">"url"</span><span class="p">: </span><span class="s">"<a href="' + E(proj.url) + '" target="_blank">' + jesc(proj.name) + '</a>"</span><span class="p"> }</span>';
    if (comma) line += '<span class="p">,</span>';
    push(2, line);
  });
  push(1, '<span class="p">],</span>');
  push(0, '');
}
