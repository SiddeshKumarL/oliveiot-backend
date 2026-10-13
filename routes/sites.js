const router = require('express').Router();
const Site = require('../models/Site');
const Meter = require('../models/Meter');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const sites = await Site.find().sort({ id: 1 }).lean();
  const counts = await Meter.aggregate([{ $group: { _id: '$siteId', n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map(c => [c._id, c.n]));
  res.json(sites.map(s => ({ ...s, meterCount: map[s.id] || 0 })));
});

router.post('/', requireRole('superadmin'), async (req, res) => {
  const { name, location, contact, status } = req.body;
  if (!name || !location || !contact) return res.status(400).json({ message: 'name, location, contact required' });
  const count = await Site.countDocuments();
  const site = await Site.create({ id: `site-${count + 1}`, name, location, contact, status });
  res.status(201).json(site);
});

router.put('/:id', requireRole('superadmin', 'siteadmin'), async (req, res) => {
  if (req.user.role === 'siteadmin' && req.user.siteId !== req.params.id)
    return res.status(403).json({ message: 'You can only edit your own site' });
  const site = await Site.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  site ? res.json(site) : res.status(404).json({ message: 'Site not found' });
});

router.delete('/:id', requireRole('superadmin'), async (req, res) => {
  const site = await Site.findOneAndDelete({ id: req.params.id });
  site ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Site not found' });
});

module.exports = router;
