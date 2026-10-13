const router = require('express').Router();
const Report = require('../models/Report');
const { auth } = require('../middleware/auth');

router.use(auth);

// GET /api/reports?site=site-1&meter=MTR-101&from=2026-06-12&to=2026-06-19
router.get('/', async (req, res) => {
  const { site, meter, from, to } = req.query;
  const filter = {};
  if (site) filter.siteId = site;
  if (meter) filter.meterId = meter;
  if (from || to) filter.date = { ...(from && { $gte: from }), ...(to && { $lte: to }) };
  const rows = await Report.find(filter).sort({ date: -1 }).lean();
  res.json(rows.map(r => ({ ...r, netConsumption: +(r.endIndex - r.startIndex).toFixed(1) })));
});

module.exports = router;
