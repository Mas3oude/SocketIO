const { Router } = require('express');
const router = new Router();
const notificationRouter = require('./notification');

router.use('/notificationTest',notificationRouter);
module.exports = router;