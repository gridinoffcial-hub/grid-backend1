// middleware/auth.js
// Simple PIN-based admin authentication
// In production, upgrade to JWT tokens

const adminAuth = (req, res, next) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;

  if (!pin) {
    return res.status(401).json({ success: false, error: 'Admin PIN required. Pass it as x-admin-pin header.' });
  }

  if (pin !== process.env.ADMIN_PIN) {
    console.warn(`[AUTH] Failed admin attempt from ${req.ip} at ${new Date().toISOString()}`);
    return res.status(403).json({ success: false, error: 'Invalid admin PIN.' });
  }

  next();
};

module.exports = { adminAuth };
