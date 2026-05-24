const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        // Check PNG signature
        if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
            return null;
        }
        // Read IHDR width and height
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
    } catch (e) {
        return null;
    }
}

const basePath = path.join(process.cwd(), 'assets', 'sprites', 'Cute');

function scanDir(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory does not exist: ${dir}`);
        return;
    }
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (item.endsWith('.png')) {
            const dims = getPngDimensions(fullPath);
            const rel = path.relative(basePath, fullPath);
            console.log(`${rel}: ${dims ? `${dims.width}x${dims.height}` : 'invalid png'}`);
        }
    }
}

console.log("Cute sprites PNG dimensions:");
console.log(`Scanning base path: ${basePath}`);
scanDir(basePath);
