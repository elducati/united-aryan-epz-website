const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

const widths = [320, 640, 1024, 1600];
const outDir = path.join(__dirname, '..', 'assets', 'optimized');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function processImage(file) {
  const rel = path.relative(path.join(__dirname, '..'), file);
  const parsed = path.parse(rel);
  const destDir = path.join(outDir, parsed.dir);
  ensureDir(destDir);

  const baseName = parsed.name;
  const ext = parsed.ext.toLowerCase();

  const outputs = [];

  for (const w of widths) {
    const outJpeg = path.join(destDir, `${baseName}-${w}.jpg`);
    const outWebp = path.join(destDir, `${baseName}-${w}.webp`);
    try {
      await sharp(file).resize({ width: w }).jpeg({ quality: 75 }).toFile(outJpeg);
      await sharp(file).resize({ width: w }).webp({ quality: 75 }).toFile(outWebp);
      outputs.push({ width: w, jpeg: path.relative(path.join(__dirname, '..'), outJpeg), webp: path.relative(path.join(__dirname, '..'), outWebp) });
    } catch (err) {
      console.error('Error processing', file, err.message);
    }
  }

  return { original: rel, outputs };
}

async function run() {
  ensureDir(outDir);
  const patterns = [
    'img/**/*.{jpg,jpeg,png}',
    'assets/images/**/*.{jpg,jpeg,png}',
    'images/**/*.{jpg,jpeg,png}',
    'assets/**/*.{jpg,jpeg,png}'
  ];

  const files = patterns.flatMap(p => glob.sync(p, { nodir: true }));
  console.log(`Found ${files.length} images`);

  const manifest = [];
  for (const f of files) {
    const abs = path.join(__dirname, '..', f);
    if (!fs.existsSync(abs)) continue;
    // skip SVGs and already optimized
    const result = await processImage(abs);
    manifest.push(result);
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Image optimization complete. Manifest written to assets/optimized/manifest.json');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
