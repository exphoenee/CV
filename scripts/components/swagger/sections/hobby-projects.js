import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderHobbyProjectsSection(data) {
  var E = escHtml;
  var hobbyResp = '';
  data.hobbyProjects.forEach(function (p) {
    hobbyResp +=
      '<p class="cv-kv"><a href="' +
      E(p.url) +
      '" target="_blank" rel="noopener noreferrer"><code>' +
      E(p.name.replace(/[\s-]/g, '').toLowerCase()) +
      '</code>' +
      E(p.name) +
      '</a></p>';
  });
  return swgTagSection(
    'hobbyProjects',
    swgGet(
      'hobbyProjects',
      'get_hobbyProjects',
      '/hobbyProjects',
      'Side projects & open-source work',
      '<p>Returns hobby projects and open-source contributions.</p>',
      null,
      [{ code: '200', bodyHtml: hobbyResp, linksHtml: 'No links' }],
    ),
  );
}
