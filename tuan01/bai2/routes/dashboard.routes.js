const router = require('express').Router();

const dashboardController = require('../controller/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), dashboardController.dashboard);

module.exports = router;