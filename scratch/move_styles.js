
const fs = require('fs');

const html = fs.readFileSync('cv-swagger.html', 'utf8');
const cssPath = 'styles/cv-swagger.css';
let css = fs.readFileSync(cssPath, 'utf8');

const styleRegex = /style="([^"]+)"/g;
const styleMap = new Map();
let styleCounter = 0;

const newHtml = html.replace(styleRegex, (match, styleContent) => {
    // Standardize style content
    const style = styleContent.trim().replace(/;$/, '') + ';';
    
    if (!styleMap.has(style)) {
        const className = `cv-inline-${styleCounter++}`;
        styleMap.set(style, className);
    }
    
    const className = styleMap.get(style);
    return `class="${className}"`; // This is simplified, might conflict with existing classes
});

// Better replacement that appends class if class attribute already exists
const refinedHtml = html.replace(/<([a-z0-9]+)([^>]+)style="([^"]+)"/gi, (match, tag, before, styleContent) => {
    const style = styleContent.trim().replace(/;$/, '') + ';';
    if (!styleMap.has(style)) {
        const className = `cv-inline-${styleCounter++}`;
        styleMap.set(style, className);
    }
    const className = styleMap.get(style);
    
    if (before.includes('class="')) {
        return `<${tag}${before.replace('class="', `class="${className} `)}`.replace(/\s+class="/, ' class="');
    } else {
        return `<${tag}${before}class="${className}"`;
    }
});

let cssAppend = '\n\n/* Extracted Inline Styles */\n';
for (const [style, className] of styleMap.entries()) {
    cssAppend += `.${className} { ${style} }\n`;
}

fs.writeFileSync('cv-swagger.html', refinedHtml);
fs.writeFileSync(cssPath, css + cssAppend);

console.log(`Moved ${styleMap.size} unique styles to ${cssPath}`);
