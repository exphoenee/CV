import { escHtml } from '../../../shared.js';
import { swgGet, swgPost, swgPut } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';
import { swgStack } from '../ui/stack-chips.js';

export function renderWorkExperienceSection(data) {
  var E = escHtml;
  var workEndpoints = [];

  data.workExperience.forEach(function (exp, i) {
    var id = 'experience_' + exp.id;
    var path = '/experience/' + exp.id;
    var desc = exp.title + ' - ' + exp.company;
    if (exp.isCurrent) desc += ' <span class="cv-badge">current</span>';

    var descHtml = '<p>' + exp.description.split('<br>')[0] + '</p>';

    var paramRows = [];
    var periodComment = exp.isCurrent ? 'null=still here' : '';
    var periodStr = exp.period.from + ' \u2192 ' + (exp.period.to || 'null');
    if (exp.id === 'telekom') periodComment = '4 months - short but intense';
    else if (exp.id === 'aegex') periodComment = 'null=still here';
    else if (exp.id === 'cobotx') periodComment = null;
    var periodHtml =
      '<p>' + periodStr + (periodComment ? ' <em>// ' + periodComment + '</em>' : '') + '</p>';
    paramRows.push({ name: 'period', type: 'string', loc: '(metadata)', descHtml: periodHtml });

    if (exp.teamSize && exp.id !== 'webforsol') {
      var teamComment =
        exp.id === 'aegex'
          ? 'self + 1 mid-level colleague, handled with care'
          : exp.id === 'cobotx'
            ? 'engineers, built and led personally'
            : '';
      var teamHtml =
        '<p>' + exp.teamSize + (teamComment ? ' <em>// ' + teamComment + '</em>' : '') + '</p>';
      paramRows.push({ name: 'teamSize', type: 'integer', loc: '(metadata)', descHtml: teamHtml });
    }

    var stackHtml = swgStack(exp.skills);
    paramRows.push({
      name: 'stack',
      type: 'array',
      loc: '(metadata)',
      descHtml:
        '<div class="cv-stack">' +
          stackHtml.replace('<div class="cv-stack">', '').replace('</div>', '') || stackHtml,
    });

    if (exp.id === 'cobotx') {
      paramRows.push({
        name: 'robots',
        type: 'integer',
        loc: '(metadata)',
        descHtml: '<p>4 <em>// Collaborative robots, not the other kind</em></p>',
      });
    }

    var respBody = '';
    if (exp.projects) {
      exp.projects.forEach(function (proj) {
        respBody += '<p><strong>' + E(proj.name) + '</strong>- ' + E(proj.subtitle) + '</p><ul>';
        proj.bullets.forEach(function (b) {
          respBody += '<li>' + b + '</li>';
        });
        respBody += '</ul>';
      });
      if (exp.id === 'aegex') {
        respBody +=
          '<p><em>releaseCycle: 30d \u2192 14d (targeting 7) \u00B7 testCoverage before: 0 // yes, zero. it was not fine.</em></p>';
      }
    } else if (Array.isArray(exp.bullets)) {
      respBody += '<ul>';
      exp.bullets.forEach(function (b) {
        respBody += '<li>' + b + '</li>';
      });
      if (exp.id === 'telekom')
        respBody +=
          '<li>Continuous frontend\u2013AI backend integration in fast-paced Agile sprints</li>';
      if (exp.id === 'scolia')
        respBody +=
          '<li>WebSocket-driven live score updates - because darts is apparently a realtime sport</li>';
      respBody += '</ul>';
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      respBody += '<ul>';
      Object.keys(exp.bullets).forEach(function (key) {
        var arr = exp.bullets[key];
        if (Array.isArray(arr))
          arr.forEach(function (b) {
            respBody += '<li>' + b + '</li>';
          });
      });
      if (exp.id === 'cubicfox') {
        respBody +=
          '<li>Established team code conventions - arrived, fixed things, left. classic.</li>';
      }
      respBody += '</ul>';
    }

    var linksHtml = 'No links';
    if (exp.refs && exp.refs.length > 0) {
      linksHtml = exp.refs
        .map(function (r) {
          return '<a href="' + E(r.url) + '" target="_blank">' + E(r.label) + '</a>';
        })
        .join('<br />');
    }

    var methods = ['POST', 'POST', 'POST', 'POST', 'PUT', 'PUT'];
    var ep;
    if (methods[i] === 'POST') {
      ep = swgPost('workExperience', id, path, desc, descHtml, paramRows, [
        { code: '200', bodyHtml: respBody, linksHtml: linksHtml },
      ]);
    } else {
      ep = swgPut('workExperience', id, path, desc, descHtml, paramRows, [
        { code: '200', bodyHtml: respBody, linksHtml: linksHtml },
      ]);
    }
    workEndpoints.push(ep);
  });

  return swgTagSection('workExperience', workEndpoints.join(''));
}
