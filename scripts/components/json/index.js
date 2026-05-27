import { html, raw } from '../../shared.js';
import { pushStr, pushBool } from './helpers.js';
import { renderIdentity } from './sections/identity.js';
import { renderWorkExperience } from './sections/work-experience.js';
import { renderEducation } from './sections/education.js';
import { renderSkills } from './sections/skills.js';
import { renderCommunity } from './sections/community.js';
import { renderHobbyProjects } from './sections/hobby-projects.js';

export function renderJsonCV(data) {
  var L = [];

  function push(depth, content) {
    L.push([depth, content]);
  }

  push(0, '<span class="p">{</span>');
  push(0, '');

  push(1, html`<span class="c">// Viktor Bozzay - curriculum_vitae.json - v${data.meta.version}</span>`);
  push(1, '<span class="c">// Last commit: 2026-05-07 · still actively maintained</span>');
  push(0, '');
  push(1, html`<span class="k">"$schema"</span><span class="p">: </span><span class="s">"https://bozzayviktor.hu/schemas/human/developer/v${data.meta.version}.json"</span><span class="p">,</span>`);
  pushBool(push, 1, 'deprecated', false, true, 'still actively maintained');
  push(1, '<span class="k">"license"</span><span class="p">: </span><span class="s">"proprietary"</span><span class="p">,</span>  <span class="c">// not open source (yet)</span>');
  push(0, '');

  renderIdentity(data, push);

  pushStr(push, 1, 'summary', data.summary);
  push(1, '<span class="c">// translation: will rewrite your entire codebase if provoked (and the evidence justifies it)</span>');
  push(0, '');

  renderWorkExperience(data, push);
  renderEducation(data, push);
  renderSkills(data, push);
  renderCommunity(data, push);
  renderHobbyProjects(data, push);

  push(1, '<span class="k">"meta"</span><span class="p">: {</span>');
  push(2, '<span class="k">"generatedBy"</span><span class="p">: </span><span class="s">"human effort + CodersRank + Claude (probably)"</span><span class="p">,</span>');
  push(2, '<span class="k">"codingPhilosophy"</span><span class="p">: </span><span class="s">"deliberate, evidence-driven, system-level thinking"</span><span class="p">,</span>');
  pushBool(push, 2, 'engineeringBackground', true, true, '3× BEng - thinks in systems, not just components');
  push(2, '<span class="k">"openToWork"</span><span class="p">: </span><span class="nl">true</span>  <span class="c">// ask directly: bozzay.viktor@gmail.com</span>');
  push(1, '<span class="p">}</span>');
  push(0, '');
  push(0, '<span class="p">}</span>');

  return L;
}
