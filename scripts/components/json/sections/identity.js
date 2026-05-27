import { html, raw } from '../../../shared.js';
import { pushStr, pushBool } from '../helpers.js';

export function renderIdentity(data, push) {
  push(1, '<span class="k">"identity"</span><span class="p">: {</span>');
  pushStr(push, 2, 'name', data.identity.name);
  pushStr(push, 2, 'role', data.identity.role, true, '"Developer" is an understatement');
  pushStr(push, 2, 'location', data.identity.location);
  pushStr(push, 2, 'accentColor', data.meta.accentColor, true, 'hardcoded in the original HTML - yes, I looked');

  push(2, '<span class="k">"contact"</span><span class="p">: {</span>');
  var contactMap = {};
  data.identity.contacts.forEach(function (c) {
    if (c.label.indexOf('@') > -1) contactMap.email = c;
    else if (c.label.indexOf('+36') > -1) contactMap.phone = c;
    else if (c.label.indexOf('github') > -1) contactMap.github = c;
    else if (c.label.indexOf('linkedin') > -1) contactMap.linkedin = c;
    else if (c.label.indexOf('bozzayviktor') > -1) contactMap.website = c;
  });

  var contactKeys = ['email', 'phone', 'github', 'linkedin', 'website'];
  contactKeys.forEach(function (k, ki) {
    var c = contactMap[k];
    if (c && c.url) {
      var href = k === 'email' ? 'mailto:' + c.label : (k === 'phone' ? 'tel:' + c.label : c.url);
      var comma = ki < contactKeys.length - 1;
      var comment = k === 'github' ? "phoenix, with extra e's" : null;
      var link = html`<a href="${href}">${c.label}</a>`;
      var h = html`<span class="k">"${k}"</span><span class="p">: </span><span class="s">"${raw(link)}"</span>`;
      if (comma) h += '<span class="p">,</span>';
      if (comment) h += html`  <span class="c">// ${comment}</span>`;
      push(3, h);
    }
  });
  push(2, '<span class="p">},</span>');

  push(2, '<span class="k">"languages"</span><span class="p">: {</span>');
  var langComments = {
    Hungarian: 'no runtime errors',
    German: 'can order Schnitzel and read stack traces',
    English: "you're reading this - proof it works"
  };
  data.identity.languages.forEach(function (lang, li) {
    var comma = li < data.identity.languages.length - 1;
    var h = html`<span class="k">"${lang.name}"</span><span class="p">: </span><span class="s">"${lang.level.toLowerCase()}"</span>`;
    if (comma) h += '<span class="p">,</span>';
    var comment = langComments[lang.name];
    if (comment) h += html`  <span class="c">// ${comment}</span>`;
    push(3, h);
  });
  push(2, '<span class="p">}</span>');

  push(1, '<span class="p">},</span>');
  push(0, '');
}
