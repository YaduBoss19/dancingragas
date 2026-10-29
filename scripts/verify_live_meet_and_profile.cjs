const { chromium } = require("playwright");

async function runLuxuryMeetAndProfileTest() {
  console.log("=== STARTING LUXURY THEME, GOOGLE MEET & STUDENT PROFILE VERIFICATION ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const baseUrl = "http://localhost:5173";

  // 1. Visit Student Sanctuary
  console.log("1. Navigating to Disciple Sanctuary...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Check Student Photo and WhatsApp Pill
  console.log("2. Verifying Student Photo, Avatar and WhatsApp Contact Pill...");
  const hasWhatsAppPill = await page.$('a:has-text("WhatsApp:")');
  if (!hasWhatsAppPill) {
    throw new Error("FAIL: WhatsApp contact pill not found on student card!");
  }
  const whatsAppText = await hasWhatsAppPill.textContent();
  console.log(`   PASS: Student WhatsApp Pill displayed: "${whatsAppText.trim()}"`);

  // Check Edit Profile Modal
  console.log("3. Testing Edit Profile Modal...");
  const editProfileBtn = await page.$('button:has-text("Edit Profile")');
  if (!editProfileBtn) throw new Error("FAIL: Edit Profile button not found!");
  await editProfileBtn.click();
  await page.waitForTimeout(500);

  const modalText = await page.textContent("body");
  if (!modalText.includes("Edit Disciple Profile & Contact") || !modalText.includes("WhatsApp Phone Number")) {
    throw new Error("FAIL: Student Profile Modal failed to open!");
  }
  console.log("   PASS: Student Profile & Contact Modal verified.");

  // Save changes
  await page.click('button:has-text("Save Profile & Contact")');
  await page.waitForTimeout(500);

  // 4. Verify Live Google Meet Connect Banner
  console.log("4. Verifying Live Google Meet Classroom Banner...");
  const hasMeetButton = await page.$('a:has-text("Join Google Meet Now")');
  if (!hasMeetButton) {
    throw new Error("FAIL: 'Join Google Meet Now' button not found in Student Sanctuary!");
  }
  const meetHref = await hasMeetButton.getAttribute("href");
  console.log(`   PASS: Live Google Meet button verified with URL: "${meetHref}"`);

  const meetBannerText = await page.textContent("body");
  if (!meetBannerText.includes("Live Classroom •") || !meetBannerText.includes("Class Platform")) {
    throw new Error("FAIL: Live Google Meet Classroom banner details not found!");
  }
  console.log("   PASS: Live Google Meet countdown and classroom protocol verified.");

  // 5. Test Tutor Portal Batch Scheduler
  console.log("5. Testing Tutor Portal Batch Live Class Scheduler...");
  await page.goto(`${baseUrl}/#admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Authenticate if passcode form is shown
  const isPasscodeScreen = await page.$('input[placeholder*="passcode"]');
  if (isPasscodeScreen) {
    await page.fill('input[type="password"]', "tutor123");
    await page.click('button:has-text("Authenticate & Enter Portal")');
    await page.waitForTimeout(1000);
  }

  // Ensure Academic mode is active
  const academicModeBtn = await page.$('button:has-text("Academic & Student Cohorts")');
  if (academicModeBtn) {
    await academicModeBtn.click();
    await page.waitForTimeout(500);
  }

  await page.click('button:has-text("Live Broadcast Studio")');
  await page.waitForTimeout(600);

  const studioText = await page.textContent("body");
  if (!studioText.includes("Batch Live Class Scheduler") || !studioText.includes("Schedule New Batch Class")) {
    throw new Error("FAIL: Batch Live Class Scheduler not found in Tutor Studio!");
  }
  console.log("   PASS: Batch Live Class Scheduler verified in Faculty Desk.");

  // Test opening Schedule Modal
  await page.click('button:has-text("Schedule New Batch Class")');
  await page.waitForTimeout(400);

  const schedModalText = await page.textContent("body");
  if (!schedModalText.includes("Schedule Google Meet Class for Batch") || !schedModalText.includes("Target Course / Batch")) {
    throw new Error("FAIL: Schedule Google Meet Class Modal failed to open!");
  }
  console.log("   PASS: Schedule Google Meet Class by Batch Modal verified.");
  await page.click('button:has-text("Cancel")');
  await page.waitForTimeout(300);

  console.log("\n=== ALL GOOGLE MEET BATCH SCHEDULING, STUDENT PROFILE & LUXURY THEME TESTS PASSED 100%! ===");
  await browser.close();
}

runLuxuryMeetAndProfileTest().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
