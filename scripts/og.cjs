// Render the social preview image (1200x630) from scripts/og.html into public/og.png.
// Usage: NODE_PATH=<node_modules with playwright> node scripts/og.cjs
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("file://" + path.resolve(__dirname, "og.html"), { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, "../public/og.png") });
  await browser.close();
})();
