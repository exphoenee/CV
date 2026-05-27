import { html, raw } from '../../../shared.js';
import { pushStr, pushNum, pushBool, pushStringArray } from '../helpers.js';

export function renderWorkExperience(data, push) {
  push(1, '<span class="k">"workExperience"</span><span class="p">: [</span>');
  push(0, '');

  data.workExperience.forEach(function (exp, ei) {
    var companyNames = ['Aegex Technologies', 'Deutsche Telekom IT Solutions HU', 'Scolia Technologies Ltd.', 'Cubicfox', 'CobotX Technologies', 'WebforSol (Freelance)'];
    var alias = companyNames[ei] || exp.company;
    var dashLen = Math.max(55 - alias.length, 5);
    var dashes = '─'.repeat(dashLen);
    push(2, html`<span class="c">// [${ei}] ${alias} ${raw(dashes)}</span>`);

    push(2, '<span class="p">{</span>');
    pushStr(push, 3, 'company', exp.company);
    pushStr(push, 3, 'title', exp.title);

    var toSpan = exp.period.to
      ? html`<span class="s">"${exp.period.to}"</span>`
      : '<span class="nl">null</span>';
    var periodLine = html`<span class="k">"period"</span><span class="p">: { </span><span class="k">"from"</span><span class="p">: </span><span class="s">"${exp.period.from}"</span><span class="p">, </span><span class="k">"to"</span><span class="p">: </span>${raw(toSpan)}<span class="p"> }</span><span class="p">,</span>`;
    if (exp.isCurrent) periodLine += '  <span class="c">// null = still here</span>';
    else if (exp.id === 'telekom') periodLine += '  <span class="c">// 4 months - short but intense</span>';
    push(3, periodLine);

    if (exp.id === 'aegex') {
      pushNum(push, 3, 'teamSize', 2, true, 'self + 1 mid-level colleague, handled with care');
    } else if (exp.id === 'cobotx') {
      pushNum(push, 3, 'teamSize', 4, true, 'engineers, built and led personally');
    }

    pushStr(push, 3, 'description', exp.description);

    if (exp.id === 'cobotx') {
      pushBool(push, 3, 'robots', true, true, 'literal robots. Universal Robots. not metaphorical.');
    }
    if (exp.id === 'webforsol') {
      pushBool(push, 3, 'parallel_with_cobotx', true, true, '24h is enough for two jobs, apparently');
    }

    if (exp.projects) {
      push(3, '<span class="k">"projects"</span><span class="p">: {</span>');
      exp.projects.forEach(function (proj, pi) {
        var comma = pi < exp.projects.length - 1;
        push(4, html`<span class="k">"${proj.name}"</span><span class="p">: {</span>`);
        pushStr(push, 5, 'type', proj.subtitle);
        if (proj.name === 'FACTS') {
          pushNum(push, 5, 'releaseCycle_before_days', 30);
          pushNum(push, 5, 'releaseCycle_after_days', 14, true, 'targeting 7 - AI-assisted workflow');
          pushNum(push, 5, 'testCoverage_before', 0, true, 'yes, zero. it was fine. (it was not fine.)');
          push(5, '<span class="k">"qualityIssues_after"</span><span class="p">: </span><span class="s">"near eliminated"</span><span class="p">,</span>');
        }
        pushStringArray(push, 5, proj.bullets, true);
        if (proj.name !== 'FACTS') {
          push(5, '<span class="k">"ref"</span><span class="p">: [</span>');
          push(6, '<span class="s">"Not public"</span>');
          push(5, '<span class="p">]</span>');
        }
        if (proj.name === 'FACTS' && exp.refs) {
          push(5, '<span class="k">"ref"</span><span class="p">: [</span>');
          exp.refs.forEach(function (r, ri) {
            var link = html`<a href="${r.url}" target="_blank">${r.label}</a>`;
            var line = html`<span class="s">"${raw(link)}"</span>`;
            if (ri < exp.refs.length - 1) line += '<span class="p">,</span>';
            push(6, line);
          });
          push(5, '<span class="p">],</span>');
        }
        push(4, '<span class="p">}</span>' + (comma ? '<span class="p">,</span>' : ''));
      });
      push(3, '<span class="p">},</span>');
    } else if (Array.isArray(exp.bullets)) {
      pushStringArray(push, 3, exp.bullets, true);
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      var allBullets = [];
      Object.keys(exp.bullets).forEach(function (key) {
        var arr = exp.bullets[key];
        if (Array.isArray(arr)) arr.forEach(function (b) { allBullets.push(b); });
      });
      if (exp.id === 'cubicfox') {
        allBullets.push('Established team code conventions - arrived, fixed things, left. classic.');
      }
      push(3, '<span class="k">"highlights"</span><span class="p">: [</span>');
      allBullets.forEach(function (b, bi) {
        var line = html`<span class="s">"${b}"</span>`;
        if (bi < allBullets.length - 1) line += '<span class="p">,</span>';
        push(4, line);
      });
      push(3, '<span class="p">],</span>');
    }

    if (!exp.projects && exp.refs && exp.refs.length > 0) {
      if (exp.refs.length === 1) {
        var link1 = html`<a href="${exp.refs[0].url}" target="_blank">${exp.refs[0].label}</a>`;
        push(3, html`<span class="k">"ref"</span><span class="p">: </span><span class="s">"${raw(link1)}"</span><span class="p">,</span>`);
      } else {
        push(3, '<span class="k">"refs"</span><span class="p">: [</span>');
        exp.refs.forEach(function (r, ri) {
          var link = html`<a href="${r.url}" target="_blank">${r.label}</a>`;
          var line = html`<span class="s">"${raw(link)}"</span>`;
          if (ri < exp.refs.length - 1) line += '<span class="p">,</span>';
          push(4, line);
        });
        push(3, '<span class="p">],</span>');
      }
    }

    if (exp.skills && exp.skills.length > 0) {
      pushStringArray(push, 3, exp.skills, false);
    } else {
      push(3, '<span class="k">"stack"</span><span class="p">: [</span>');
      push(3, '<span class="p">]</span>');
    }

    push(2, '<span class="p">}</span>');
    push(0, '');
  });

  push(1, '<span class="p">],</span>');
  push(0, '');
}
