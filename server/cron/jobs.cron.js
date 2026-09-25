const cron = require('node-cron');
const { runJobScraper } = require('../services/scraper/scraper.service');

const initializeCronJobs = () => {
  // Run the web scraper every day at 2:00 AM
  // Format: second minute hour day-of-month month day-of-week
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cron] Triggering daily web scraping pipeline...');
    await runJobScraper();
  });

  console.log('[Cron] Scheduled job scraping pipeline initialized (Daily at 2:00 AM).');

  // Trigger it once immediately on startup for demonstration and initial data population
  // Wrapping in setTimeout so it doesn't block server startup
  setTimeout(() => {
    console.log('[Cron] Running initial scraping pipeline boot...');
    runJobScraper().catch(err => console.error('Initial scrape failed:', err));
  }, 5000);
};

module.exports = {
  initializeCronJobs
};
