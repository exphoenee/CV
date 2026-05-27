import { escHtml } from '../../../shared.js';
import { svgClipboard, svgLockUnlocked, svgArrowUp } from '../ui/icons.js';
import { swgGet, swgDesc } from '../ui/endpoint-block.js';
import { swgParams } from '../ui/params-table.js';
import { swgResponses } from '../ui/responses.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderSkillsSection(data) {
  var E = escHtml;
  var skillEndpoints = [];

  var primarySkills = data.programmingLanguages.filter(function (p) { return ['TypeScript', 'JavaScript', 'CSS', 'SCSS', 'HTML'].indexOf(p.name) > -1; });
  var primaryResp = '';
  primarySkills.forEach(function (p) { primaryResp += '<p class="cv-kv"><code>' + E(p.name.toLowerCase()) + '</code>experto</p>'; });
  primaryResp += '<p><em>// These are not "frameworks". These are the actual technologies.</em></p>';
  skillEndpoints.push(swgGet('skills', 'get_skills_primary', '/skills/primary', 'Core frontend stack', '<p>Returns core frontend technology proficiencies.</p>', null, [{code: '200', bodyHtml: primaryResp, linksHtml: 'No links'}]));

  var backendSkills = data.programmingLanguages.filter(function (p) { return ['Python', 'PHP'].indexOf(p.name) > -1; });
  var backendResp = '';
  backendSkills.forEach(function (p) { backendResp += '<p class="cv-kv"><code>' + E(p.name.toLowerCase()) + '</code>proficient</p>'; });
  backendResp += '<p class="cv-kv"><code>express.js</code>proficient</p><p class="cv-kv"><code>nestjs</code>proficient</p><p class="cv-kv"><code>mysql</code>proficient</p><p class="cv-kv"><code>mongodb</code>proficient</p>';
  skillEndpoints.push(swgGet('skills', 'get_skills_backend', '/skills/backend', 'Backend & databases', '<p>Returns backend and database proficiencies.</p>', null, [{code: '200', bodyHtml: backendResp, linksHtml: 'No links'}]));

  var testingBody = '<p><code>jest</code>proficient</p><p><code>vitest</code>proficient</p><p><code>playwright</code>proficient</p><p class="cv-kv"><code>coverage</code><em>before: 0 // yes, zero. after: yes.</em></p>';
  var patchBlock = '<div class="opblock opblock-patch" id="operations-skills-patch_skills_testing"><div class="opblock-summary opblock-summary-patch"><button class="opblock-summary-control"><span class="opblock-summary-method">PATCH</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>/skills/testing</span></a></span><div class="opblock-summary-description">Testing & quality (improving daily)</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">' + svgClipboard + '</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">' + svgLockUnlocked + '</button><button class="opblock-control-arrow">' + svgArrowUp + '</button></div><div class="opblock-body">' + swgDesc('<p>Testing stack and methodologies. Coverage is improving daily.</p>') + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + swgParams(null) + '</div>' + swgResponses([{code: '200', bodyHtml: testingBody, linksHtml: 'No links'}]) + '</div></div>';
  skillEndpoints.push(patchBlock);

  var toolingResp = '<p class="cv-kv"><code>vite</code>experto</p><p class="cv-kv"><code>webpack</code>experto</p><p class="cv-kv"><code>pnpm</code>experto</p><p class="cv-kv"><code>npm</code>experto</p><p class="cv-kv"><code>git</code>experto</p><p><em>// Know the difference between pnpm and npm. One of them respects disk space.</em></p>';
  skillEndpoints.push(swgGet('skills', 'get_skills_tooling', '/skills/tooling', 'Tools & build', '<p>Returns build tools and dev tooling proficiencies.</p>', null, [{code: '200', bodyHtml: toolingResp, linksHtml: 'No links'}]));

  var aiResp = '<p class="cv-kv"><code>claude</code>architect-level</p><p class="cv-kv"><code>codex</code>architect-level</p><p class="cv-kv"><code>chatgpt</code>advanced</p><p class="cv-kv"><code>copilot</code>advanced</p><p><em>// AI is not replacing developers. Developers who use AI are replacing those who don\'t.</em></p>';
  skillEndpoints.push(swgGet('skills', 'get_skills_ai', '/skills/ai', 'AI & automation', '<p>Returns AI tooling and automation proficiencies.</p>', null, [{code: '200', bodyHtml: aiResp, linksHtml: 'No links'}]));

  var roboticsResp = '<p class="cv-kv"><code>universal-robots</code>proficient</p><p class="cv-kv"><code>plc-programming</code>proficient</p><p class="cv-kv"><code>machine-vision</code>proficient</p><p class="cv-kv"><code>onrobot</code>proficient</p><p class="cv-kv"><code>onshape</code>proficient</p><p><em>// Yes, actual robots. Not the framework kind. The moving-metal kind.</em></p>';
  skillEndpoints.push(swgGet('skills', 'get_skills_robotics', '/skills/robotics', 'Robotics & hardware', '<p>Returns robotics and hardware proficiencies.</p>', null, [{code: '200', bodyHtml: roboticsResp, linksHtml: 'No links'}]));

  var deleteBlock = '<div class="opblock opblock-delete" id="operations-skills-delete_skills_delete"><div class="opblock-summary opblock-summary-delete"><button class="opblock-summary-control"><span class="opblock-summary-method">DELETE</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>/skills/legacy-code</span></a></span><div class="opblock-summary-description">Delete legacy code (use with caution)</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">' + svgClipboard + '</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">' + svgLockUnlocked + '</button><button class="opblock-control-arrow">' + svgArrowUp + '</button></div><div class="opblock-body">' + swgDesc('<p>Deletes legacy code. All of it. Use with extreme caution. <em>// You called the DELETE endpoint on production. Your funeral.</em></p>') + '<div class="opblock-section"><div class="opblock-section-header"><div class="tab-header"><div class="tab-item active"><h4 class="opblock-title"><span>Parameters</span></h4></div></div><div class="try-out"><button class="try-out__btn hire-trigger">Hire me</button></div></div>' + swgParams([{name: 'justification', type: 'string', loc: '(metadata)', descHtml: '<p>Why are you deleting this? <em>// "it was legacy" is not a valid justification</em></p>'}]) + '</div>' + swgResponses([{code: '200', bodyHtml: '<p>Legacy code deleted successfully.</p><p><em>// You have 24 hours to regret this decision.</em></p>', linksHtml: 'No links'}, {code: '418', bodyHtml: '<p>I\'m a teapot.</p><p><em>// Short and stout. Here is my handle. Here is my spout.</em></p>', linksHtml: 'No links'}]) + '</div></div>';
  skillEndpoints.push(deleteBlock);

  return swgTagSection('skills', skillEndpoints.join(''));
}
