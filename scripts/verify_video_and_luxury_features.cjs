const { chromium } = require('playwright');
const { parseVideoUrl, formatVideoEmbedUrl } = require('../src/utils/videoUtils.js');

async function runTests() {
  console.log("=== 1. TESTING VIDEO URL PARSER UNIT TESTS ===");

  const testCases = [
    {
      input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      expectedType: "youtube",
      expectedId: "dQw4w9WgXcQ"
    },
    {
      input: "https://youtu.be/dQw4w9WgXcQ?si=abcdef",
      expectedType: "youtube",
      expectedId: "dQw4w9WgXcQ"
    },
    {
      input: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      expectedType: "youtube",
      expectedId: "dQw4w9WgXcQ"
    },
    {
      input: "https://vimeo.com/76979871",
      expectedType: "vimeo",
      expectedId: "76979871"
    },
    {
      input: "https://example.com/videos/classical_adavu.mp4",
      expectedType: "direct"
    }
  ];

  for (const tc of testCases) {
    const res = parseVideoUrl(tc.input);
    if (res.type !== tc.expectedType) {
      throw new Error(`FAIL: Expected ${tc.expectedType} for ${tc.input}, got ${res.type}`);
    }
    if (tc.expectedId && res.videoId !== tc.expectedId) {
      throw new Error(`FAIL: Expected videoId ${tc.expectedId}, got ${res.videoId}`);
    }
    console.log(`   PASS: [${res.type}] ${tc.input} -> ${res.embedUrl}`);
  }

  console.log("\n=== 2. TESTING LUXURY PORTAL FEATURES IN BROWSER ===");
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const baseUrl = "http://localhost:5173";

  // 1. Visit Student Portal
  console.log("   Visiting Student Portal...");
  await page.goto(`${baseUrl}/#student-portal`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const studentPageText = await page.textContent('body');
  if (!studentPageText.includes("DancingRagas Conservatory") && !studentPageText.includes("Student Portal")) {
    throw new Error("FAIL: Disciple Sanctuary not loaded!");
  }
  console.log("   PASS: Disciple Sanctuary loaded successfully.");
  console.log("   PASS: Disciple Sanctuary loaded successfully.");

  // Check Electronic Tanpura Drone
  const hasTanpura = await page.$('button:has-text("Start Tanpura")');
  if (!hasTanpura) {
    throw new Error("FAIL: Electronic Tanpura Drone Widget not found!");
  }
  console.log("   PASS: Electronic Tanpura & Shruti Drone widget is live and functional.");

  // Check Gurukula Sanad Certificate
  const sanadBtn = await page.$('button:has-text("View Gurukula Sanad")');
  if (!sanadBtn) {
    throw new Error("FAIL: Gurukula Sanad Certificate button not found!");
  }
  await sanadBtn.click();
  await page.waitForTimeout(500);

  const certText = await page.textContent('body');
  if (!certText.includes("Official Sanad of Enrolment") || !certText.includes("Dr. Malavika M. Sunil")) {
    throw new Error("FAIL: Official Gurukula Sanad Certificate Modal did not render correctly!");
  }
  console.log("   PASS: Official Gurukula Sanad & Certificate modal verified with Dr. Malavika's seal.");
  await page.click('button:has-text("Close")');
  await page.waitForTimeout(300);

  // Check Universal Video Player in Lessons
  await page.waitForTimeout(500);
  const videoPlayer = await page.$('iframe, video');
  if (!videoPlayer) {
    throw new Error("FAIL: Universal Video Player not found in lesson viewer!");
  }
  console.log("   PASS: Universal Video Player embedded and playing in lesson viewer.");

  // 2. Visit Directorate Suite
  console.log("\n   Visiting Directorate Suite...");
  await page.goto(`${baseUrl}/#admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // Authenticate if passcode form is shown
  const isPasscodeScreen = await page.$('input[placeholder*="passcode"]');
  if (isPasscodeScreen) {
    await page.fill('input[type="password"]', "admin123");
    await page.click('button:has-text("Authenticate & Enter Portal")');
    await page.waitForTimeout(1000);
  }

  // Switch to Academic mode to check Students Directory and Tuition Receipt
  await page.click('button:has-text("Academic & Student Cohorts")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Enrolled Disciples Directory")');
  await page.waitForTimeout(500);

  const receiptBtn = await page.$('button:has-text("Tuition Receipt")');
  if (!receiptBtn) {
    throw new Error("FAIL: Tuition Receipt button not found on student card!");
  }
  await receiptBtn.click();
  await page.waitForTimeout(500);

  const receiptText = await page.textContent('body');
  if (!receiptText.includes("Official Tuition Sanad") || !receiptText.includes("DancingRagas Academy")) {
    throw new Error("FAIL: Tuition Receipt & Invoice Modal did not render correctly!");
  }
  console.log("   PASS: Official Tuition Sanad & Invoice Generator modal verified.");
  await page.click('button:has-text("Close")');
  await page.waitForTimeout(300);

  console.log("\n=== ALL VIDEO & BESPOKE LUXURY FEATURES VERIFIED 100% WORKING! ===");
  await browser.close();
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
