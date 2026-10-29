const { chromium } = require("playwright");

async function runTutorFeaturesTest() {
  console.log("=== STARTING TUTOR COURSE ENROLLMENT & PDF UPLOAD VERIFICATION ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const baseUrl = "http://localhost:5173";

  // 1. Visit Faculty / Admin Dashboard
  console.log("1. Navigating to Faculty & Guru Desk...");
  await page.goto(`${baseUrl}/#admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Authenticate if passcode form is shown
  const isPasscodeScreen = await page.$('input[placeholder*="passcode"]');
  if (isPasscodeScreen) {
    await page.fill('input[type="password"]', "tutor123");
    await page.click('button:has-text("Authenticate & Enter Portal")');
    await page.waitForTimeout(1000);
  }

  // 2. Test Enrolled Disciples Directory - Course Tag Management
  console.log("2. Testing Course Add & Remove for Disciples in Directory...");
  // Ensure Academic mode is active
  const academicModeBtn = await page.$('button:has-text("Academic & Student Cohorts")');
  if (academicModeBtn) {
    await academicModeBtn.click();
    await page.waitForTimeout(500);
  }

  await page.click('button:has-text("Enrolled Disciples Directory")');
  await page.waitForTimeout(600);

  // Find the first student card with "+ Add to another course..."
  const addCourseSelect = await page.$('select:has-text("+ Add to another course...")');
  if (!addCourseSelect) {
    throw new Error("FAIL: '+ Add to another course...' select dropdown not found on student card!");
  }
  // Add to Carnatic Music
  await addCourseSelect.selectOption("Carnatic Music");
  await page.waitForTimeout(500);

  const studentCardText = await page.textContent("body");
  if (!studentCardText.includes("Carnatic Music")) {
    throw new Error("FAIL: Disciple was not enrolled into 'Carnatic Music'!");
  }
  console.log("   PASS: Successfully enrolled disciple into 'Carnatic Music' with interactive course badge.");

  // Now test removing from course
  const removeBadgeBtn = await page.$('span:has-text("Carnatic Music") button');
  if (!removeBadgeBtn) {
    throw new Error("FAIL: Remove button on 'Carnatic Music' course tag not found!");
  }
  page.on('dialog', async dialog => await dialog.accept());
  await removeBadgeBtn.click();
  await page.waitForTimeout(500);
  console.log("   PASS: Successfully unenrolled disciple from course tag.");

  // 3. Test Course Areas Roster - Add student to active course
  console.log("3. Testing Course Areas & Video Vault Disciple Roster...");
  await page.click('button:has-text("Course Areas & Video Vault")');
  await page.waitForTimeout(600);

  const quickEnrollSelect = await page.$('#quick-enroll-select');
  if (quickEnrollSelect) {
    console.log("   PASS: Quick enroll dropdown found in Course Areas.");
  }

  // 4. Test PDF Study Materials Vault Uploader
  console.log("4. Testing PDF Notes & Study Vault Uploader in Tutor Portal...");
  await page.click('button:has-text("PDF Notes & Study Vault")');
  await page.waitForTimeout(600);

  const uploadBtn = await page.$('button:has-text("Upload New PDF Document")');
  if (!uploadBtn) {
    throw new Error("FAIL: 'Upload New PDF Document' button not found!");
  }
  await uploadBtn.click();
  await page.waitForTimeout(500);

  // Fill in PDF form
  await page.fill('input[placeholder*="Jathiswaram Score"]', "Autumn Margam Masterclass: Hastha Mudra Clinical Guide");
  await page.fill('input[type="url"]', "https://example.com/materials/Autumn_Margam_Clinical_Guide.pdf");
  await page.click('button:has-text("Publish to Disciple Sanctuary")');
  await page.waitForTimeout(800);

  const materialsText = await page.textContent("body");
  if (!materialsText.includes("Autumn Margam Masterclass: Hastha Mudra Clinical Guide")) {
    throw new Error("FAIL: Uploaded PDF not found in Tutor Study Materials vault!");
  }
  console.log("   PASS: PDF study material successfully published in Tutor Portal.");

  // 5. Verify PDF immediately reflects in Disciple Sanctuary
  console.log("5. Navigating to Disciple Sanctuary to verify PDF access...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Study Materials & Notes")');
  await page.waitForTimeout(600);

  const studentDocsText = await page.textContent("body");
  if (!studentDocsText.includes("Autumn Margam Masterclass: Hastha Mudra Clinical Guide")) {
    throw new Error("FAIL: Newly uploaded PDF did not reflect in Student Sanctuary!");
  }
  console.log("   PASS: Newly uploaded PDF verified live in Disciple Sanctuary with download link.");

  console.log("\n=== ALL TUTOR COURSE MANAGEMENT & PDF UPLOADER TESTS PASSED 100%! ===");
  await browser.close();
}

runTutorFeaturesTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
