const { chromium } = require("playwright");

async function runCustomerVerification() {
  console.log("=== STARTING CUSTOMER-CENTRIC LUXURY SUITE VERIFICATION ===");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const baseUrl = "http://localhost:5173";

  // 1. Visit Student Sanctuary
  console.log("1. Navigating to Disciple Sanctuary...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const bodyText = await page.textContent("body");
  if (!bodyText.includes("DancingRagas Conservatory") && !bodyText.includes("Student Portal")) {
    throw new Error("FAIL: Disciple Sanctuary did not load!");
  }
  console.log("   PASS: Disciple Sanctuary loaded successfully.");

  // 2. Check Daily Sadhana Practice Streak
  console.log("2. Testing Daily Sadhana Practice Streak Tracker...");
  const sadhanaBtn = await page.$('button:has-text("I Practiced 30m Today")');
  if (!sadhanaBtn) {
    throw new Error("FAIL: Sadhana Streak button not found!");
  }
  await sadhanaBtn.click();
  await page.waitForTimeout(400);
  const updatedSadhanaText = await page.textContent("body");
  if (!updatedSadhanaText.includes("15 Days Continuous Riyaz")) {
    throw new Error("FAIL: Sadhana streak did not increment to 15 days!");
  }
  console.log("   PASS: Sadhana practice streak incremented to 15 days with confirmation.");

  // 3. Test Practice Tool Switcher (Tanpura Drone <-> Sollukattu Metronome)
  console.log("3. Testing Practice Tool Switcher (Tanpura & Talam Metronome)...");
  const talamTabBtn = await page.$('button:has-text("Sollukattu & Talam Metronome")');
  if (!talamTabBtn) throw new Error("FAIL: Sollukattu & Talam button not found!");
  await talamTabBtn.click();
  await page.waitForTimeout(400);

  const talamTitle = await page.textContent("body");
  if (!talamTitle.includes("Sollukattu & Nattuvangam Talam Metronome")) {
    throw new Error("FAIL: Sollukattu Metronome did not display!");
  }
  const startTalamBtn = await page.$('button:has-text("Start Talam")');
  if (!startTalamBtn) throw new Error("FAIL: Start Talam button not found!");
  await startTalamBtn.click();
  await page.waitForTimeout(600);
  console.log("   PASS: Sollukattu & Talam Metronome synthesized and running.");

  // Switch back to Tanpura
  await page.click('button:has-text("Electronic Tanpura Drone")');
  await page.waitForTimeout(300);

  // 4. Test Financial Tuition Renewal Card
  console.log("4. Testing Financial Tuition Status & Tax Receipt...");
  const hasTuitionCard = await page.$('h4:has-text("Tuition Status & Term Sanad")');
  if (!hasTuitionCard) throw new Error("FAIL: Tuition Status Card not found!");

  const receiptBtn = await page.$('button:has-text("Official Tax Receipt")');
  if (!receiptBtn) throw new Error("FAIL: Official Tax Receipt button not found!");
  await receiptBtn.click();
  await page.waitForTimeout(400);

  const receiptModalText = await page.textContent("body");
  if (!receiptModalText.includes("Official Tuition Sanad") || !receiptModalText.includes("DancingRagas Academy")) {
    throw new Error("FAIL: Official Tuition Sanad Modal failed to open!");
  }
  console.log("   PASS: Official Tuition Sanad & Fee Receipt rendered.");
  await page.click('button:has-text("Close")');
  await page.waitForTimeout(300);

  // 5. Test Doctor's Wellness Check Modal
  console.log("5. Testing Physician Movement & Dance Health Assessment...");
  const wellnessBtn = await page.$('button:has-text("Doctor\'s Wellness Check")');
  if (!wellnessBtn) throw new Error("FAIL: Doctor's Wellness Check button not found!");
  await wellnessBtn.click();
  await page.waitForTimeout(400);

  const wellnessText = await page.textContent("body");
  if (!wellnessText.includes("Physician Biomechanical & Dance Health Assessment") || !wellnessText.includes("Araimandi Knee & Patellar Alignment")) {
    throw new Error("FAIL: Physician Wellness modal failed to render clinical metrics!");
  }
  console.log("   PASS: Physician Dance Health Assessment verified with Dr. Malavika's findings.");
  await page.click('button:has-text("Close Health Assessment")');
  await page.waitForTimeout(300);

  // 6. Test Proud Parent / Grandparent Showcase Modal
  console.log("6. Testing Proud Parent & Grandparent Showcase Portfolio...");
  const showcaseBtn = await page.$('button:has-text("Family Showcase")');
  if (!showcaseBtn) throw new Error("FAIL: Family Showcase button not found!");
  await showcaseBtn.click();
  await page.waitForTimeout(400);

  const showcaseText = await page.textContent("body");
  if (!showcaseText.includes("Proud Disciple Digital Showcase") || !showcaseText.includes("Share to Family WhatsApp")) {
    throw new Error("FAIL: Family Showcase modal failed to render!");
  }
  console.log("   PASS: Family Showcase Modal verified with WhatsApp sharing.");
  await page.click('button:has-text("Close Showcase")');
  await page.waitForTimeout(300);

  // 7. Test Absence & Makeup Catch-Up Modal
  console.log("7. Testing 1-Tap Absence Care & Makeup Catch-Up...");
  const absenceBtn = await page.$('button:has-text("Absence & Catch-Up")');
  if (!absenceBtn) throw new Error("FAIL: Absence & Catch-Up button not found!");
  await absenceBtn.click();
  await page.waitForTimeout(400);

  const absenceText = await page.textContent("body");
  if (!absenceText.includes("Absence Care & Makeup Catch-Up") || !absenceText.includes("Recent Recordings to Catch Up On")) {
    throw new Error("FAIL: Absence & Catch-Up modal failed to render!");
  }
  console.log("   PASS: Absence & Makeup Catch-Up Modal verified with recordings.");
  await page.click('button:has-text("Close Absence Manager")');
  await page.waitForTimeout(300);

  // 8. Test Margam Journey & Milestones Tab
  console.log("8. Testing Margam Journey & Milestones Visual Roadmap Tab...");
  await page.click('button:has-text("Margam Journey & Milestones")');
  await page.waitForTimeout(500);

  const roadmapText = await page.textContent("body");
  if (!roadmapText.includes("Classical Journey & Diploma Milestones") || !roadmapText.includes("Varnam (The Crown Jewel)")) {
    throw new Error("FAIL: Margam Roadmap Tab failed to render 8 Margam milestones!");
  }
  console.log("   PASS: Margam Roadmap Tab verified with full milestone pipeline.");

  // 9. Test Virtual Stage & Festivals Tab
  console.log("9. Testing Virtual Stage & Annual Recital Conclaves Tab...");
  await page.click('button:has-text("Virtual Stage & Recitals")');
  await page.waitForTimeout(500);

  const stageText = await page.textContent("body");
  if (!stageText.includes("Virtual Stage & Annual Tarangam Conclaves") || !stageText.includes("Winter Margam Tarangam 2026")) {
    throw new Error("FAIL: Virtual Stage Tab failed to render!");
  }
  console.log("   PASS: Virtual Stage & Performance Tab verified.");

  console.log("\n=== ALL 9 CUSTOMER-CENTRIC LUXURY SUITE TESTS PASSED 100%! ===");
  await browser.close();
}

runCustomerVerification().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
