const fs = require('fs');
const path = require('path');
const glob = require('glob');

const manifestPath = path.join(__dirname, '..', 'assets', 'optimized', 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('manifest.json not found at', manifestPath);
  console.error('Run `npm run images:optimize` first to generate optimized images.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function buildSrcset(outputs, key) {
  // outputs: [{width, jpeg, webp}, ...]
  return outputs
    .map(o => `${o[key]} ${o.width}w`)
    .join(', ');
}

function escapeForRegex(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const htmlFiles = glob.sync('*.html', { nodir: true });

for (const htmlFile of htmlFiles) {
  let content = fs.readFileSync(htmlFile, 'utf8');
  let modified = false;

  for (const entry of manifest) {
    const original = entry.original.replace(/\\/g, '/');
    const relOriginal = original;
    const re = new RegExp('<img\\b([^>]*?)\\bsrc=["\']' + escapeForRegex(relOriginal) + '["\']([^>]*?)>', 'gi');
    content = content.replace(re, (match, pre, post) => {
      modified = true;
      // try to extract alt attribute
      const altMatch = match.match(/alt=["']([^"']*)["']/i);
      const altText = altMatch ? altMatch[1] : '';

      const outputs = entry.outputs.sort((a, b) => a.width - b.width);
      const webpSrcset = buildSrcset(outputs, 'webp');
      const jpegSrcset = buildSrcset(outputs, 'jpeg');

      const sizes = '(max-width: 1024px) 100vw, 1024px';

      const picture = `\n<picture>\n  <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">\n  <source type="image/jpeg" srcset="${jpegSrcset}" sizes="${sizes}">\n  <img loading="lazy" src="${relOriginal}" alt="${altText}">\n</picture>`;
      return picture;
    });
  }

  if (modified) {
    fs.writeFileSync(htmlFile, content, 'utf8');
    console.log('Updated', htmlFile);
  }
}

console.log('Wiring complete. Review HTML files for layout and alt text accuracy.');
