export function renderCommunity(data) {
  return `
    <div class="blockTitle noBreakBeforeAfter cv-block-title"><span>Community &amp; Mentorship</span></div>
    <div class="item noBreakInside cv-item">
      <div class="itemDescription">
        ${data.community}
      </div>
    </div>
  `;
}
