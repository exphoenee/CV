import { escHtml } from '../../../shared.js';
import { jesc, pushStr } from '../helpers.js';

export function renderEducation(data, push) {
  var E = escHtml;

  push(1, '<span class="k">"education"</span><span class="p">: [</span>');
  push(2, '<span class="c">// all three degrees from the same university - he really liked it there</span>');
  data.education.degrees.forEach(function (deg, di) {
    push(2, '<span class="p">{</span>');
    pushStr(push, 3, 'institution', data.education.institution);
    pushStr(push, 3, 'degree', deg.title);
    push(3, '<span class="k">"years"</span><span class="p">: </span><span class="s">"' + jesc(deg.years) + '"</span>');
    if (di < data.education.degrees.length - 1) {
      push(2, '<span class="p">},</span>');
    } else {
      push(2, '<span class="p">}</span>');
    }
  });
  push(1, '<span class="p">],</span>');
  push(1, '<span class="c">// none of them are frontend. this is fine. (this is fine.)</span>');
  push(0, '');
}
