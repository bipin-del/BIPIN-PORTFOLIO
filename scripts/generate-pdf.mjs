import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

async function generate() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const htmlPath = path.resolve('public', 'resume.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.resolve('public', 'Bipin_S_Menon_Resume.pdf'),
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '14mm',
      right: '14mm'
    }
  });
  await browser.close();
  console.log('PDF generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
