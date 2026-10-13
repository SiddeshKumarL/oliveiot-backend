require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors({ origin: [process.env.CLIENT_URL, 'http://localhost:5173'] }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ status: 'OliveIoT API running' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sites', require('./routes/sites'));
app.use('/api/meters', require('./routes/meters'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/summary', require('./routes/summary'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

connectDB().then(() =>
  app.listen(process.env.PORT || 5000, () => console.log('API on port ' + (process.env.PORT || 5000)))
).catch(e => { console.error(e); process.exit(1); });
