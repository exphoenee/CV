import { escHtml } from '../../../shared.js';
import { svgClipboard, svgLockUnlocked, svgArrowUp } from './icons.js';

export function swgSummary(method, path, desc, extraBadge) {
  var cls = method.toLowerCase();
  var badge = extraBadge ? ' ' + extraBadge : '';
  return (
    '<div class="opblock-summary opblock-summary-' +
    cls +
    '"><button class="opblock-summary-control"><span class="opblock-summary-method">' +
    method +
    '</span><div class="opblock-summary-path-description-wrapper"><span class="opblock-summary-path"><a class="nostyle"><span>' +
    escHtml(path) +
    '</span></a></span><div class="opblock-summary-description">' +
    desc +
    badge +
    '</div></div></button><div class="view-line-link copy-to-clipboard" title="Copy to clipboard">' +
    svgClipboard +
    '</div><button class="authorization__btn unlocked" aria-label="authorization button unlocked">' +
    svgLockUnlocked +
    '</button><button class="opblock-control-arrow">' +
    svgArrowUp +
    '</button></div>'
  );
}
