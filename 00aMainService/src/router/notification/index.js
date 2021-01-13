const { Router } = require('express');
const {jwtAccessProtect} = require('../../middleware/jwtProtect');
const validatePaginationQueryString = require('../../middleware/validatePaginationQuery');
const validateRequest = require('../../middleware/validateRequest');
const {getMessagesbyUserId} = require('../../controller');


const router = new Router();
router.get('/',(req,res)=>{
    res.send(`this is the default router thank you ..`);
});

router.get('/me',
         jwtAccessProtect,
         validatePaginationQueryString,
         validateRequest,
         getMessagesbyUserId
);

module.exports = router;