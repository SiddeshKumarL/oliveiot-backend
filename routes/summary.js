const router = require('express').Router();
const Site = require('../models/Site');
const Meter = require('../models/Meter');
const Alert = require('../models/Alert');
const { auth } = require('../middleware/auth');

// Dashboard KPI cards
router.get('/', auth, async (req, res) => {
  const [totalSites, totalMeters, onlineMeters, activeAlerts, criticalActive] = await Promise.all([
    Site.countDocuments(), Meter.countDocuments(), Meter.countDocuments({ status: 'Online' }),
    Alert.countDocuments({ acknowledged: false }),
    Alert.countDocuments({ acknowledged: false, severity: 'Critical' })
  ]);
  res.json({ totalSites, totalMeters, onlineMeters, offlineMeters: totalMeters - onlineMeters,
             activeAlerts, criticalIssues: criticalActive });
});

module.exports = router;
