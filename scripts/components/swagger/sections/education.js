import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderEducationSection(data) {
  var E = escHtml;
  var eduEndpoints = [];
  var eduPaths = ['/education/quality-manager', '/education/teacher', '/education/mechanical'];
  var eduIds = ['get_quality-manager', 'get_teacher', 'get_mechanical'];
  var eduDescs = [
    "Bachelor's - Quality Manager, 2003\u20132007",
    "Bachelor's - Machinery Technical Teacher Education, 2001\u20132004",
    'Bachelor of Engineering (BEng), Mechanical Engineering, 2000\u20132004',
  ];

  data.education.degrees.forEach(function (deg, i) {
    var resp =
      '<p class="cv-kv"><code>institution</code>' +
      E(data.education.institution) +
      '</p><p class="cv-kv"><code>degree</code>' +
      E(deg.title) +
      '</p><p class="cv-kv"><code>years</code>' +
      E(deg.years) +
      '</p>';
    eduEndpoints.push(
      swgGet(
        'education',
        eduIds[i],
        eduPaths[i],
        eduDescs[i],
        '<p>Returns education details.</p>',
        null,
        [{ code: '200', bodyHtml: resp, linksHtml: 'No links' }],
      ),
    );
  });

  return swgTagSection('education', eduEndpoints.join(''));
}
