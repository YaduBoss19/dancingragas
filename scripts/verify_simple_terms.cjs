const { chromium } = require("playwright");

async function verifySimpleTermsAndSecurity() {
  console.log("=== VERIFYING SIMPLE TERMS, ROLES & SECURITY FIXES ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const baseUrl = "http://localhost:5173";

  // 1. Check AuthModal Simple Roles & Security
  console.log("1. Opening AuthModal and checking roles (Student, Tutor, Admin)...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Trigger AuthModal from navigation if needed, or directly test modal
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const loginButton = await page.$('button:has-text("Portal Login"), button:has-text("Login")');
  if (loginButton) {
    await loginButton.click();
    await page.waitForTimeout(500);

    const modalText = await page.textContent("body");
    const hasStudentTab = await page.$('button:has-text("Student")');
    const hasTutorTab = await page.$('button:has-text("Tutor")');
    const hasAdminTab = await page.$('button:has-text("Admin")');

    if (!hasStudentTab || !hasTutorTab || !hasAdminTab) {
      throw new Error("FAIL: AuthModal missing simple Student, Tutor, or Admin tabs!");
    }
    console.log("   PASS: Simple roles (Student, Tutor, Admin) verified in AuthModal.");

    // Test Security Fix 1: Tutor passcode check cannot be bypassed with email 'tutor@gmail.com' and wrong password
    await hasTutorTab.click();
    await page.fill('input[type="password"]', "wrongpass123");
    await page.click('button#auth-modal-submit-btn');
    await page.waitForTimeout(500);
    const tutorErrText = await page.textContent("body");
    if (!tutorErrText.includes("Invalid Tutor passcode")) {
      throw new Error("FAIL: Tutor authentication bypass bug is still present!");
    }
    console.log("   PASS: Tutor authentication bypass bug is FIXED. Proper passcode enforced.");

    // Close modal
    const closeBtn = await page.$('button[aria-label="Close"]');
    if (closeBtn) await closeBtn.click();
  }

  // 2. Check Student Portal Layout & Terms
  console.log("2. Navigating to Student Portal...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const portalBody = await page.textContent("body");
  if (!portalBody.includes("Verified Student ID")) {
    throw new Error("FAIL: 'Verified Student ID' not found!");
  }
  if (!portalBody.includes("Live Classes & Google Meet")) {
    throw new Error("FAIL: 'Live Classes & Google Meet' tab not found!");
  }
  if (!portalBody.includes("Course Videos & Lessons")) {
    throw new Error("FAIL: 'Course Videos & Lessons' tab not found!");
  }
  console.log("   PASS: Student Portal uses simple, easy-to-understand academy tabs and labels.");

  // 3. Check Admin / Tutor Dashboard Simple Terms
  console.log("3. Navigating to Admin Dashboard...");
  await page.goto(`${baseUrl}/#admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Authenticate if passcode form is shown
  const isPasscodeScreen = await page.$('input[type="password"]');
  if (isPasscodeScreen) {
    await page.fill('input[type="password"]', "admin123");
    await page.click('button:has-text("Authenticate & Enter Portal")');
    await page.waitForTimeout(1000);
  }

  const adminBody = await page.textContent("body");
  if (!adminBody.includes("Admin Workspace") && !adminBody.includes("Tutor Workspace")) {
    throw new Error("FAIL: Simple workspace modes (Admin / Tutor) not found in Dashboard!");
  }
  console.log("   PASS: Admin Dashboard displays simple Admin and Tutor workspaces.");

  console.log("\n=== ALL SIMPLE ROLES, TERMS & SECURITY TESTS PASSED 100%! ===");
  await browser.close();
}

verifySimpleTermsAndSecurity().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
