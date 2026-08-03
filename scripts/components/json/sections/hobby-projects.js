import { html, raw } from '../../../shared.js';

export function renderHobbyProjects(data, push) {
  push(1, '<span class="k">"hobbyProjects"</span><span class="p">: [</span>');
  data.hobbyProjects.forEach(function (proj, hi) {
    var comma = hi < data.hobbyProjects.length - 1;
    var link = html`<a href="${proj.url}" target="_blank" rel="noopener noreferrer">${proj.name}</a>`;
    var line = html`<span class="p">{ </span><span class="k">"name"</span><span class="p">: </span
      ><span class="s">"${raw(link)}"</span><span class="p">, </span><span class="k">"url"</span
      ><span class="p">: </span><span class="s">"${raw(link)}"</span><span class="p"> }</span>`;
    if (comma) line += '<span class="p">,</span>';
    push(2, line);
  });
  push(1, '<span class="p">],</span>');
  push(0, '');
}
