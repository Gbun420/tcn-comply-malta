const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  });
  
  options.port = chrome.port;
  options.logLevel = 'info';
  
  try {
    const runnerResult = await lighthouse(url, options);
    const reportFile = `lighthouse-report-${Date.now()}.html`;
    fs.writeFileSync(reportFile, runnerResult.report);
    
    const { categories } = runnerResult.lhr;
    console.log('\n📊 LIGHTHOUSE RESULTS: ' + url);
    console.log('='.repeat(50));
    
    Object.values(categories).forEach(category => {
      console.log(`${category.title}: ${Math.round(category.score * 100)}/100`);
    });
    
    console.log(`\n📄 Full report saved to: ${reportFile}`);
    
    return runnerResult;
  } finally {
    await chrome.kill();
  }
}

async function runAllTests() {
  const urls = [
    'https://tcn-comply-malta.vercel.app/auth/login',
    'https://tcn-comply-malta.vercel.app/dashboard'
  ];
  
  for (const url of urls) {
    try {
      console.log(`\n🚀 Testing: ${url}`);
      await runLighthouse(url);
    } catch (error) {
      console.error(`❌ Error testing ${url}:`, error.message);
    }
  }
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runLighthouse, runAllTests };
