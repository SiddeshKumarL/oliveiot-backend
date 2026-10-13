require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Site = require('./models/Site');
const Meter = require('./models/Meter');
const Alert = require('./models/Alert');
const Report = require('./models/Report');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Site, Meter, Alert, Report].map(M => M.deleteMany({})));

  const hash = (p) => bcrypt.hashSync(p, 10);
  await User.insertMany([
    { email: 'admin@oliveiot.com', password: hash('admin123'), role: 'superadmin' },
    { email: 'siteadmin@oliveiot.com', password: hash('site123'), role: 'siteadmin', siteId: 'site-1' },
    { email: 'operator@oliveiot.com', password: hash('operator123'), role: 'operator' },
    { email: 'client@oliveiot.com', password: hash('client123'), role: 'viewer' }
  ]);

  await Site.insertMany([
    { id: 'site-1', name: 'Chennai Plant Main', location: 'Guindy, Chennai', contact: 'R. Vignesh', status: 'Active' },
    { id: 'site-2', name: 'Coimbatore Assembly Unit', location: 'Peelamedu, Coimbatore', contact: 'K. Sundar', status: 'Active' },
    { id: 'site-3', name: 'Madurai Distribution Center', location: 'Kappalur, Madurai', contact: 'M. Rajesh', status: 'Active' },
    { id: 'site-4', name: 'Trichy Fabrication Lab', location: 'Thuvakudi, Trichy', contact: 'S. Kumar', status: 'Inactive' }
  ]);

  const m = (meterId, name, siteId, location, voltage, current, powerFactor, frequency, kwh, status = 'Online') =>
    ({ meterId, name, siteId, location, voltage, current, powerFactor, frequency, kwh, status });
  await Meter.insertMany([
    m('MTR-101', 'Main Grid Incomer', 'site-1', 'Substation Panel A', 233.7, 123.4, 0.94, 49.99, 45285.1),
    m('MTR-102', 'CNC Machine Feed', 'site-1', 'Workshop Bay 2', 240.4, 84.4, 0.81, 50.02, 12408.0),
    m('MTR-103', 'Assembly Line A', 'site-2', 'Main Assembly Hall', 241.3, 45.2, 0.74, 50.02, 8943.3),
    m('MTR-104', 'Robotic Welding Panel', 'site-2', 'Welding Section', 235.9, 90.3, 0.88, 50.01, 18242.1),
    m('MTR-105', 'Cold Storage Panel', 'site-3', 'Compressor Room', 242.9, 67.4, 0.91, 50.0, 34122.2),
    m('MTR-106', 'HVAC Main Unit', 'site-1', 'Utility Block', 0, 0, 0, 0, 7421.9, 'Offline'),
    m('MTR-107', 'Trichy Testing Room', 'site-4', 'Testing Room', 0, 0, 0, 0, 0, 'Offline')
  ]);

  const ago = (min) => new Date(Date.now() - min * 60000);
  await Alert.insertMany([
    { type: 'Over Current', meter: 'CNC Machine Feed', siteId: 'site-1', severity: 'Critical', triggeredAt: ago(6) },
    { type: 'Low Power Factor', meter: 'Assembly Line A', siteId: 'site-2', severity: 'Warning', triggeredAt: ago(16) },
    {
      type: 'Meter Offline', meter: 'HVAC Main Unit', siteId: 'site-1', severity: 'Critical', triggeredAt: ago(61),
      acknowledged: true, acknowledgedBy: 'admin@oliveiot.com'
    }
  ]);

  // Illustrative audit data (06-13 and 06-12 values are placeholders)
  const r = (date, startIndex, endIndex) =>
    ({ date, siteId: 'site-1', meterId: 'MTR-101', startIndex, endIndex, remarks: 'Operational Shift Normal' });
  await Report.insertMany([
    r('2026-06-19', 10675.7, 10791.7), r('2026-06-18', 10550.0, 10675.7),
    r('2026-06-17', 10430.4, 10550.0), r('2026-06-16', 10316.3, 10430.4),
    r('2026-06-15', 10199.5, 10316.3), r('2026-06-14', 10176.6, 10199.5),
    r('2026-06-13', 10101.2, 10176.6), r('2026-06-12', 9985.0, 10101.2)
  ]);

  console.log('Seeded: 4 users, 4 sites, 7 meters, 3 alerts, 8 reports');
  process.exit(0);
})();
