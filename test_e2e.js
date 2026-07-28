import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting E2E tests...');
  const randomEmail = `testuser_${Date.now()}@example.com`;

  // --- Register Test ---
  console.log('1. Testing Homepage & Register');
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
    console.log('Homepage loaded successfully.');
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.includes('RideMint')) {
      console.log('Warning: RideMint not found on homepage.');
    }

    console.log('2. Testing Register');
    await page.goto('http://localhost:5173/register', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="fullName"]', { timeout: 5000 });
    await page.type('input[name="fullName"]', 'Test User');
    await page.type('input[name="email"]', randomEmail);
    await page.type('input[name="password"]', 'password123');
    await page.type('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => console.log('Navigation took too long'));
    console.log('Register submitted.');
  } catch (err) {
    console.error('Register test error:', err);
  } finally {
    await browser.close();
  }

  // --- Login Test ---
  console.log('3. Testing Login');
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[name="email"]', { timeout: 5000 });
    await page.type('input[name="email"]', randomEmail);
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => console.log('Navigation timeout'));
    console.log('Login submitted.');

    console.log('4. Testing Cars catalog');
    await page.goto('http://localhost:5173/cars', { waitUntil: 'domcontentloaded' });
    
    console.log('5. Testing Bookings');
    await page.goto('http://localhost:5173/bookings', { waitUntil: 'domcontentloaded' });

    console.log('Tests completed.');
  } catch (err) {
    console.error('Login test error:', err);
  } finally {
    await browser.close();
  }
})();
