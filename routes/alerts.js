const router = require('express').Router();
const Alert = require('../models/Alert');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

// GET /api/alerts?status=active|acknowledged
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.status === 'active') filter.acknowledged = false;
  if (req.query.status === 'acknowledged') filter.acknowledged = true;
  res.json(await Alert.find(filter).sort({ triggeredAt: -1 }));
});

router.patch('/:id/ack', requireRole('superadmin', 'siteadmin', 'operator'), async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id, { acknowledged: true, acknowledgedBy: req.user.email }, { new: true });
  alert ? res.json(alert) : res.status(404).json({ message: 'Alert not found' });
});

module.exports = router;
