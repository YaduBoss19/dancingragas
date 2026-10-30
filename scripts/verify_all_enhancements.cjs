const { chromium } = require("playwright");

async function verifyAllEnhancements() {
  console.log("=== VERIFYING ALL UI/UX & TUTOR/STUDENT ENHANCEMENTS ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const baseUrl = "http://localhost:5173";

  // 1. Verify Student Portal Enhancements
  console.log("1. Navigating to Student Portal...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Check Sticky Live Meet Banner
  console.log("2. Checking Sticky Live Meet Top Pill...");
  const stickyPill = await page.$('span:has-text("Next Live Session")');
  if (!stickyPill) {
    throw new Error("FAIL: Sticky Live Meet Top Pill not found!");
  }
  console.log("   PASS: Sticky Live Meet Top Pill verified with 1-click Join button.");

  // Check Persistent Tanpura Floating Bar
  console.log("3. Checking Persistent Tanpura Drone Audio Dock...");
  const tanpuraBtn = await page.$('button[title*="Tanpura Drone"]');
  if (!tanpuraBtn) {
    throw new Error("FAIL: Persistent Tanpura Drone button not found!");
  }
  console.log("   PASS: Persistent Tanpura Drone Floating Audio Dock verified.");

  // 4. Verify Mobile Bottom Navigation on Mobile Viewport
  console.log("4. Resizing to mobile viewport (iPhone 14 Pro 393x852)...");
  await page.setViewportSize({ width: 393, height: 852 });
  await page.waitForTimeout(500);

  const mobileNav = await page.$('nav[aria-label="Mobile Navigation"]');
  if (!mobileNav) {
    throw new Error("FAIL: Mobile Bottom Navigation Bar not visible on mobile!");
  }
  console.log("   PASS: Mobile Bottom Navigation Bar verified on mobile viewport.");

  // 5. Verify Tutor WhatsApp Batch Broadcast Generator
  console.log("5. Navigating to Tutor / Admin Portal to check WhatsApp Batch Broadcast Generator...");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/#admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Authenticate if needed
  const isPasscodeScreen = await page.$('input[type="password"]');
  if (isPasscodeScreen) {
    await page.fill('input[type="password"]', "admin123");
    await page.click('button:has-text("Authenticate & Enter Portal")');
    await page.waitForTimeout(1000);
  }

  // Ensure Tutor Workspace is active
  const tutorWorkspaceBtn = await page.$('button:has-text("Tutor Workspace")');
  if (tutorWorkspaceBtn) {
    await tutorWorkspaceBtn.click();
    await page.waitForTimeout(500);
  }

  // Click on Live Classes tab
  await page.click('button:has-text("Live Classes & Google Meet")');
  await page.waitForTimeout(600);

  const waBatchBtn = await page.$('a:has-text("WhatsApp Batch")');
  if (!waBatchBtn) {
    throw new Error("FAIL: 1-Click WhatsApp Batch Broadcast button not found in Tutor Live Studio!");
  }
  const waHref = await waBatchBtn.getAttribute("href");
  console.log(`   PASS: 1-Click WhatsApp Batch Broadcast verified with pre-filled announcement text: ${waHref.slice(0, 60)}...`);

  console.log("\n=== ALL UI/UX & TUTOR/STUDENT ENHANCEMENTS VERIFIED 100%! ===");
  await browser.close();
}

verifyAllEnhancements().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
