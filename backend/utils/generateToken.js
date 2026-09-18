const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'nexus_smart_campus_secure_jwt_secret_2026_super_key_key', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
