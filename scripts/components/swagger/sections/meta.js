import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderMetaSection(data) {
  var E = escHtml;
  var metaResp = '<p class="cv-kv"><code>name</code>' + E(data.meta.name) + '</p><p class="cv-kv"><code>role</code>' + E(data.identity.role) + '</p><p class="cv-kv"><code>version</code>' + E(data.meta.version) + '</p><p class="cv-kv"><code>generatedBy</code>CV_DATA v' + E(data.meta.version) + ' <em>// yes, this CV generates itself</em></p><p class="cv-kv"><code>codingPhilosophy</code>refactor deliberately <em>// only when evidence justifies it</em></p><p class="cv-kv"><code>engineeringBackground</code>mechanical <em>// before there was code, there was CAD</em></p><p class="cv-kv"><code>openToWork</code>true <em>// spoiler: hire me button works</em></p>';
  return swgTagSection('meta', swgGet('meta', 'get_meta', '/meta', 'Version metadata', '<p>Returns API metadata and CV version information.</p>', null, [{code: '200', bodyHtml: metaResp, linksHtml: 'No links'}]));
}
