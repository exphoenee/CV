
const fs = require('fs');

const html = fs.readFileSync('cv-swagger.html', 'utf8');
const styleRegex = /<([a-z0-9]+)([^>]+)style="([^"]+)"([^>]*)>/gi;

let match;
let extractions = [];
let count = 0;

while ((match = styleRegex.exec(html)) !== null) {
    const [fullMatch, tag, before, style, after] = match;
    const attrs = (before + after).trim();
    
    // Try to find an ID or class for the selector
    let idMatch = attrs.match(/id="([^"]+)"/i);
    let classMatch = attrs.match(/class="([^"]+)"/i);
    
    extractions.push({
        fullMatch,
        tag,
        style,
        id: idMatch ? idMatch[1] : null,
        classes: classMatch ? classMatch[1].split(/\s+/) : [],
        context: html.substring(Math.max(0, match.index - 50), Math.min(html.length, match.index + fullMatch.length + 50))
    });
}

console.log(JSON.stringify(extractions, null, 2));
