
const { Router } = require('express');

const router = Router();



router.get(
    '/first',
    (req,res)=>{
        res.send("welcome to my service");
    }
  );
  

  module.exports = router;