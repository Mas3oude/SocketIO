const { Router } = require('express');
const {jwtAccessProtect} = require('../../middleware/jwtProtect');
const validatePaginationQueryString = require('../../middleware/validatePaginationQuery');
const validateUpdateMessageRequest = require('../../middleware/validateupdateRequest');
const validateRequest = require('../../middleware/validateRequest');
const {getMessagesbyUserId,updateMessagesbyUserIdMessageId} = require('../../controller');


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


router.put('/me',
         jwtAccessProtect,
         validateUpdateMessageRequest,
         validateRequest,
         updateMessagesbyUserIdMessageId
);

module.exports = router;