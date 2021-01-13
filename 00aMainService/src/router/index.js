const { Router } = require('express');
const router = new Router();
const notificationRouter = require('./notification');

router.use('/notification',notificationRouter);
module.exports = router;