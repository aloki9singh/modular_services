import cron from "node-cron";
import cleanupDatabase from "../utils/otpCleaner";

// Schedule the cleanup function to run every day at 3:00 am
const databaseCleaner = () => {
  cron.schedule('0 3 * * *', async () => {
    console.log('Running database cleanup...');
    await cleanupDatabase();
  });
};

export default databaseCleaner;