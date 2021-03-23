const { Router } = require('express');
const path = require('path');
const router = new Router();
router.get('/',(req,res)=>{
    res.send(`this is the default router thank you ..`);
});

router.get('/static',(req,res)=>{
    // res.sendFile('../../../public/user1.html');
    const routerPath = __dirname.split('/');
    routerPath.pop(routerPath.length-1);
    routerPath.pop(routerPath.length-1);
    routerPath.pop(routerPath.length-1);
    let rootpath='/';
    for (let i = 1; i < routerPath.length; i++) {
       rootpath += routerPath[i] + '/';
        
    }
    console.log(`the path for static file : ${rootpath+'public/testing.html'}`);
    console.log(path.join(rootpath+'public/user1.html'));
    res.sendFile(path.join(rootpath+'public/user1.html'));
  });


module.exports = router;