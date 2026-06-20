/**
 * stations.js
 * CV Stations (Houses) content and coordinate details.
 * Generated from CV_DATA when available; falls back to static data.
 */

function esc(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateWelcomeContent(data) {
  if (!data) {
    return `
<h3>Viktor Bozzay</h3>
<p><strong>Role:</strong> Frontend Tech Lead</p>
<p><strong>Location:</strong> Pécs, Hungary</p>
<p><strong>Email:</strong> bozzay.viktor@gmail.com</p>
<p><strong>Phone:</strong> +36306106608</p>
<p><strong>GitHub:</strong> github.com/exphoenee</p>
<p><strong>LinkedIn:</strong> linkedin.com/in/viktorbozzay</p>
<hr/>
<h3>Languages</h3>
<ul>
  <li><strong>Hungarian:</strong> native (no runtime errors)</li>
  <li><strong>German:</strong> B2 (can order Schnitzel and read stack traces)</li>
  <li><strong>English:</strong> B2 (you are reading this proof)</li>
</ul>
<hr/>
<h3>Summary</h3>
<p>Frontend developer who operates at the architecture level...</p>
        `;
  }

  const id = data.identity;
  if (!id) return '';

  var contacts = id.contacts || [];
  var langHtml = (id.languages || [])
    .map(function (l) {
      return '  <li><strong>' + esc(l.name) + ':</strong> ' + esc(l.level) + '</li>';
    })
    .join('\n');

  return `
<h3>${esc(id.name)}</h3>
<p><strong>Role:</strong> ${esc(id.role)}</p>
<p><strong>Location:</strong> ${esc(id.location)}</p>
${contacts
  .filter(function (c) {
    return c.url && c.url.indexOf('mailto:') === 0;
  })
  .map(function (c) {
    return '<p><strong>Email:</strong> ' + esc(c.label) + '</p>';
  })
  .join('\n')}
${contacts
  .filter(function (c) {
    return c.url && c.url.indexOf('tel:') === 0;
  })
  .map(function (c) {
    return '<p><strong>Phone:</strong> ' + esc(c.label) + '</p>';
  })
  .join('\n')}
${contacts
  .filter(function (c) {
    return c.url && c.url.indexOf('github') > -1;
  })
  .map(function (c) {
    return '<p><strong>GitHub:</strong> ' + esc(c.label) + '</p>';
  })
  .join('\n')}
${contacts
  .filter(function (c) {
    return c.url && c.url.indexOf('linkedin') > -1;
  })
  .map(function (c) {
    return '<p><strong>LinkedIn:</strong> ' + esc(c.label) + '</p>';
  })
  .join('\n')}
<hr/>
<h3>Languages</h3>
<ul>
${langHtml}
</ul>
<hr/>
<h3>Summary</h3>
<p>${esc(data.summary || '')}</p>
        `;
}

function generateExpContent(exp) {
  if (!exp) return '';

  var period = exp.periodLabel || '';
  var title = esc(exp.title || '');
  var company = esc(exp.company || '');

  var content = '\n';
  content += '<h3>' + company + '</h3>\n';
  content += '<p><strong>Period:</strong> ' + esc(period) + '</p>\n';
  content += '<p><strong>Title:</strong> ' + title + '</p>\n';

  if (exp.projects) {
    exp.projects.forEach(function (proj) {
      content += '<hr/>\n';
      content += '<h3>' + esc(proj.name) + ' (' + esc(proj.subtitle || '') + ')</h3>\n';
      content += '<ul>\n';
      (proj.bullets || []).forEach(function (b) {
        content += '  <li>' + esc(b) + '</li>\n';
      });
      content += '</ul>\n';
    });
  } else {
    content += '<hr/>\n';
    content += '<h3>Highlights</h3>\n';
    content += '<ul>\n';

    var bullets = [];
    if (Array.isArray(exp.bullets)) {
      bullets = exp.bullets;
    } else if (exp.bullets && typeof exp.bullets === 'object') {
      Object.keys(exp.bullets).forEach(function (key) {
        if (Array.isArray(exp.bullets[key])) {
          bullets = bullets.concat(exp.bullets[key]);
        }
      });
    }

    bullets.forEach(function (b) {
      content += '  <li>' + esc(b) + '</li>\n';
    });

    // Add game-specific highlights
    if (exp.game && exp.game.highlights) {
      exp.game.highlights.forEach(function (h) {
        content += '  <li>' + esc(h) + '</li>\n';
      });
    }

    content += '</ul>\n';
  }

  // References
  if (exp.refs && exp.refs.length > 0) {
    content += '<p><strong>Reference(s):</strong> ';
    content += exp.refs
      .map(function (r) {
        return '<a href="' + esc(r.url) + '" target="_blank">' + esc(r.label) + '</a>';
      })
      .join(', ');
    content += '</p>\n';
  }

  return content;
}

function generateEducationContent(data) {
  if (!data || !data.education) {
    return `
<h3>Education (University of Pécs)</h3>
<ul>
  <li><strong>Bachelor's in Quality Manager</strong> (2003–2007)</li>
  <li><strong>Bachelor's in Machinery Technical Teacher</strong> (2001–2004)</li>
  <li><strong>BEng in Mechanical Engineering</strong> (2000–2004)</li>
</ul>
<hr/>
<h3>Community & Mentorship</h3>
<ul>
  <li>Pro bono after-school programming club mentor at Mátyás Király Street Primary School, Pécs (since Feb 2026).</li>
  <li><strong>Hack and Code 2026:</strong> 1st place!</li>
  <li><strong>22nd Neumann János Programming Competition:</strong> 1st and 3rd places!</li>
  <li><strong>romannumbersjs / domelemjs:</strong> npm libraries</li>
</ul>
        `;
  }

  var content = '\n';
  content += '<h3>' + esc(data.education.institution || 'Education') + '</h3>\n';
  content += '<ul>\n';
  (data.education.degrees || []).forEach(function (d) {
    content += '  <li><strong>' + esc(d.title) + '</strong> (' + esc(d.years) + ')</li>\n';
  });
  content += '</ul>\n';

  if (data.community) {
    content += '<hr/>\n';
    content += '<h3>Community & Mentorship</h3>\n';
    content += '<ul>\n';
    content += '  <li>' + esc(data.community) + '</li>\n';
    content += '</ul>\n';
  }

  if (data.hobbyProjects && data.hobbyProjects.length > 0) {
    content += '<hr/>\n';
    content += '<h3>Hobby Projects</h3>\n';
    content += '<ul>\n';
    data.hobbyProjects.forEach(function (p) {
      content +=
        '  <li><a href="' + esc(p.url) + '" target="_blank">' + esc(p.name) + '</a></li>\n';
    });
    content += '</ul>\n';
  }

  return content;
}

// ── Generate stations from CV_DATA ──

function buildStations(data) {
  var stations = [];

  // 1. Welcome station (coordinates + labels from CV_DATA.identity.game)
  var welcomeGame = (data && data.identity && data.identity.game) || {};
  stations.push({
    id: 'welcome',
    x: welcomeGame.x,
    y: welcomeGame.y,
    title: welcomeGame.description,
    tech: welcomeGame.tech,
    content: generateWelcomeContent(data),
  });

  // 2. Work experience stations (in order, using game positions)
  if (data && data.workExperience) {
    data.workExperience.forEach(function (exp) {
      if (exp.game) {
        stations.push({
          id: exp.id,
          x: exp.game.x,
          y: exp.game.y,
          title: exp.game.description,
          tech: exp.game.tech,
          content: generateExpContent(exp),
        });
      }
    });
  }

  // 3. Education station (coordinates + labels from CV_DATA.education.game)
  var eduGame = (data && data.education && data.education.game) || {};
  stations.push({
    id: 'education',
    x: eduGame.x,
    y: eduGame.y,
    title: eduGame.description,
    tech: eduGame.tech,
    content: generateEducationContent(data),
  });

  return stations;
}

import { CV_DATA } from '../../../cv/cv-data.js';

export const CV_STATIONS = buildStations(CV_DATA);
