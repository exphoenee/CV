import { escHtml } from '../../../shared.js';
import { swgPost } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderCommunitySection(data) {
  var communityResp = '<p class="cv-kv"><code>school</code>M\u00E1ty\u00E1s Kir\u00E1ly Street Primary School, P\u00E9cs</p><p class="cv-kv"><code>since</code>2026-02</p><p class="cv-kv"><code>curriculumDesignedBy</code>Viktor</p><p class="cv-kv"><code>paid</code>false <em>// some things matter more than money</em></p><p><strong>Competition results:</strong></p><ul><li>1st place at Hack and Code 2026 (Radn\u00F3ti SZKI)</li><li>1st and 3rd place at the 22nd Neumann J\u00E1nos Programming Competition</li></ul>';
  return swgTagSection('community', swgPost('community', 'post_mentoring', '/community/mentoring', 'Mentoring & community work', '<p>Launched and lead a pro bono after-school IT and programming club. Designed the full curriculum.</p>', null, [{code: '200', bodyHtml: communityResp, linksHtml: 'No links'}]));
}
