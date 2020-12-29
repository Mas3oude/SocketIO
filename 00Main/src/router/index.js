/**
 * api folder interface
 */

const { Router } = require('express');
const whateverRouter = require('./main/whatever');
/**
 * @constant API_ROUTER
 */
const router = Router();

router.use('/main/whatever', whateverRouter);



module.exports = router;
