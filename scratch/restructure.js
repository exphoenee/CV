const fs = require('fs');
let html = fs.readFileSync('cv-plain.html', 'utf8');

// The regex needs to capture:
// 1. the logo img block
// 2. the itemTitle text
// 3. the itemDetailsWithDate block
// 4. the rest of the itemContent

const regex = /<div class="itemLogo">\s*([\s\S]*?)\s*<\/div>\s*<div class="itemContent">\s*<div class="itemTitle">([\s\S]*?)<\/div>\s*<div class="itemDetails itemDetailsWithDate">\s*([\s\S]*?)\s*<\/div>/g;

let count = 0;
html = html.replace(regex, (match, logoInner, titleInner, detailsInner) => {
  count++;
  return `<div class="itemHeaderWrapper">
          <div class="itemLogoAndTitle">
            <div class="itemLogo">
              ${logoInner.trim()}
            </div>
            <div class="itemTitle">${titleInner.trim()}</div>
          </div>
          <div class="itemDetails itemDetailsWithDate">
            ${detailsInner.trim()}
          </div>
        </div>
        <div class="itemContent">`;
});

console.log('Replaced ' + count + ' items');
fs.writeFileSync('cv-plain.html', html);
