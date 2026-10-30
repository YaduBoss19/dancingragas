const { chromium } = require("playwright");

async function scanForBugs() {
  console.log("=== SCANNING FOR BUGS, CONSOLE ERRORS & BROKEN UI FLOWS ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];

  page.on("pageerror", err => {
    errors.push({ type: "pageerror", text: err.message, stack: err.stack });
  });

  page.on("console", msg => {
    if (msg.type() === "error") {
      errors.push({ type: "console.error", text: msg.text() });
    } else if (msg.type() === "warning") {
      warnings.push({ type: "console.warn", text: msg.text() });
    }
  });

  const routes = [
    { name: "Home", url: "http://localhost:5173/" },
    { name: "About", url: "http://localhost:5173/#about" },
    { name: "Courses", url: "http://localhost:5173/#courses" },
    { name: "Gallery", url: "http://localhost:5173/#gallery" },
    { name: "Contact", url: "http://localhost:5173/#contact" },
    { name: "Student Portal", url: "http://localhost:5173/#student-portal" },
    { name: "Admin Dashboard", url: "http://localhost:5173/#admin" }
  ];

  for (const r of routes) {
    console.log(`Checking route: ${r.name} (${r.url})...`);
    try {
      await page.goto(r.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      errors.push({ type: "navigation", route: r.name, text: e.message });
    }
  }

  console.log("\n=== CONSOLE / RUNTIME ERRORS DETECTED ===");
  if (errors.length === 0) {
    console.log("No fatal unhandled page errors on initial loads.");
  } else {
    console.log(JSON.stringify(errors, null, 2));
  }

  console.log("\n=== CONSOLE WARNINGS DETECTED ===");
  console.log(`Total warnings: ${warnings.length}`);
  if (warnings.length > 0) {
    console.log(warnings.slice(0, 10));
  }

  await browser.close();
}

scanForBugs().catch(err => {
  console.error("Bug scan script failed:", err);
  process.exit(1);
});
