const router = require('express').Router();

const dashboardController = require('../controller/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware.checkToken, dashboardController.dashboard);
router.get('/admin', authMiddleware.checkToken, authMiddleware.checkRole(['admin']), dashboardController.admin);

module.exports = router;