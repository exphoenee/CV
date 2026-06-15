import { escHtml } from '../../../shared.js';

export function swgStack(skills) {
  if (!skills || skills.length === 0) return '';
  var items = skills
    .map(function (s) {
      return '<span class="cv-stack-item">' + escHtml(s) + '</span>';
    })
    .join('');
  return '<div class="cv-stack">' + items + '</div>';
}
