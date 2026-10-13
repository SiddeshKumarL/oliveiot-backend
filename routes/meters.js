const router = require('express').Router();
const Meter = require('../models/Meter');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

// GET /api/meters?site=site-1&status=Online&q=cnc
router.get('/', async (req, res) => {
  const { site, status, q } = req.query;
  const filter = {};
  if (site) filter.siteId = site;
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ meterId: rx }, { name: rx }, { location: rx }];
  }
  res.json(await Meter.find(filter).sort({ meterId: 1 }));
});

// Live reading: simulated server-side (about +/-3% around the stored base values)
router.get('/:meterId/live', async (req, res) => {
  const m = await Meter.findOne({ meterId: req.params.meterId });
  if (!m) return res.status(404).json({ message: 'Meter not found' });
  if (m.status === 'Offline') return res.json({ meterId: m.meterId, status: 'Offline' });
  const vary = (v) => +(v * (1 + (Math.random() * 0.06 - 0.03))).toFixed(1);
  const phase = (v) => ({ r: vary(v), y: vary(v), b: vary(v) });
  const V = phase(m.voltage), I = phase(m.current);
  const pf = +(0.92 + Math.random() * 0.04).toFixed(3);
  // 3-phase active power with L-N voltages: P = (VrIr + VyIy + VbIb) * PF
  const kw = +(((V.r * I.r + V.y * I.y + V.b * I.b) * pf) / 1000).toFixed(2);
  res.json({
    meterId: m.meterId, status: 'Online', voltage: V, current: I, powerFactor: pf,
    activePower: kw, frequency: +(49.8 + Math.random() * 0.4).toFixed(2), kwh: m.kwh,
    timestamp: new Date()
  });
});

router.post('/', requireRole('superadmin', 'siteadmin'), async (req, res) => {
  if (req.user.role === 'siteadmin' && req.user.siteId !== req.body.siteId)
    return res.status(403).json({ message: 'You can only add meters to your own site' });
  res.status(201).json(await Meter.create(req.body));
});

module.exports = router;
