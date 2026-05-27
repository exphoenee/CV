import { renderHeader } from './header.js';
import { renderWorkItem } from './work-item.js';
import { renderEducation } from './education.js';
import { renderLanguages } from './languages.js';
import { renderProgrammingLanguages } from './programming-languages.js';
import { renderCommunity } from './community.js';
import { renderHobbyProjects } from './hobby-projects.js';

export function renderPlainCV(data) {
  return `
    <div class="cv-plain-inline-0 cvLayout base cv">
      ${renderHeader(data)}
      <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Work Experience</span></div>
      ${data.workExperience.map(renderWorkItem).join('')}
      ${renderEducation(data)}
      ${renderLanguages(data)}
      ${renderProgrammingLanguages(data)}
      ${renderCommunity(data)}
      ${renderHobbyProjects(data)}
      <div class="poweredBy">
        <a href="https://profile.codersrank.io/user/exphoenee/" target="_blank">
          <span>Powered by</span>&nbsp;
          <img src="./assets/images/codersrank.svg" alt="codersrank" class="codersrank">
        </a>
      </div>
    </div>
  `;
}
