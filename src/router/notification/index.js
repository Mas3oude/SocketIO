const { Router } = require('express');

const router = new Router();
router.get('/',(req,res)=>{
    res.send(`this is the default router thank you ..`);
});


module.exports = router;