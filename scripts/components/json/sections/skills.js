import { html, raw } from '../../../shared.js';

export function renderSkills(data, push) {
  push(1, '<span class="k">"skills"</span><span class="p">: {</span>');

  var entries = Object.entries(data.skillGroups);
  entries.forEach(function ([key, { list, comment }], idx) {
    var isLast = idx === entries.length - 1;
    var items = list
      .map((s) => html`<span class="s">"${s}"</span>`)
      .join('<span class="p">, </span>');
    var line = html`<span class="k">"${key}"</span><span class="p">: [</span>${raw(items)}<span
        class="p"
        >]${isLast ? '' : ','}</span
      >`;
    if (comment) line += html` <span class="c">// ${comment}</span>`;
    push(2, line);
  });

  if (data.skillNote) {
    var n = data.skillNote;
    var noteLine = html`<span class="k">"${n.key}"</span><span class="p">: </span
      ><span class="s">"${n.value}"</span>`;
    if (n.comment) noteLine += html` <span class="c">// ${n.comment}</span>`;
    push(2, noteLine);
  }

  push(1, '<span class="p">},</span>');
  push(0, '');
}
