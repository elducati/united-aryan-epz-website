const http = require('http');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const PORT = process.env.PORT || 5001;
const root = process.cwd();

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function serveFile(req, res) {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';
  const safePath = path.normalize(path.join(root, reqUrl));
  if (!safePath.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  fs.stat(safePath, (err, stat) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    if (stat.isDirectory()) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    const ext = path.extname(safePath).toLowerCase();
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    fs.createReadStream(safePath).pipe(res);
  });
}

(async () => {
  const server = http.createServer(serveFile);
  server.listen(PORT, async () => {
    console.log(`Static server running at http://localhost:${PORT}`);

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });

      const el = await page.$('a.dropdown-toggle');
      if (!el) {
        console.error('No dropdown-toggle element found on the page.');
        process.exitCode = 2;
        return;
      }

      await el.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(250);
      let expanded = await el.getAttribute('aria-expanded');
      console.log('After Enter, aria-expanded=', expanded);
      if (expanded !== 'true') {
        console.error('Dropdown did not open (aria-expanded != "true").');
        process.exitCode = 3;
      } else {
        // Close with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(250);
        expanded = await el.getAttribute('aria-expanded');
        console.log('After Escape, aria-expanded=', expanded);
        if (expanded !== 'false') {
          console.error('Dropdown did not close on Escape (aria-expanded != "false").');
          process.exitCode = 4;
        } else {
          console.log('Dropdown keyboard behavior OK');
          process.exitCode = 0;
        }
      }
    } catch (err) {
      console.error('Test error:', err);
      process.exitCode = 1;
    } finally {
      await browser.close();
      server.close();
    }
  });
})();
