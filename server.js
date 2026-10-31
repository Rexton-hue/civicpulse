const { openDb } = require('./src/db');
const { createApp } = require('./src/app');
const { seedIfEmpty } = require('./src/seed');

const db = openDb();
if (process.env.SEED_DEMO !== 'off' && seedIfEmpty(db)) {
  console.log('Empty database detected: demo users and grievances were created (see README for logins).');
}

const port = process.env.PORT || 3000;
createApp(db).listen(port, () => {
  console.log(`CivicPulse running at http://localhost:${port}`);
});
