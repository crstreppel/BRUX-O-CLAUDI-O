const auth = require('./authMiddleware');
const permission = require('./permissionMiddleware');

module.exports = { auth, permission };