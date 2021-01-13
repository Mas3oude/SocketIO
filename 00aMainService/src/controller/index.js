const {
    NotFoundError,
    BadRequestError,
    ForbiddenError,
  } = require('../utils/errors');
  const {redLog,yellowLog,bluelog} = require('../utils/coloredConsole');
  const databaseService = require('../db/service');

  const getMessagesbyUserId = async(req,res,next)=>{
      try{
        const userid = req.user.id;
        const {offset, limit , seen} =req.query;
        yellowLog(`offset value : ${offset} and limit value : ${limit} value of seen parameter ${seen}`);
        const usermessages = await databaseService.getMessagesbyUserId(userid,offset,limit,seen);
         res.json(usermessages);
    }
      catch(err)
      {
          next(err);
      }
  };

  const updateMessagesbyUserIdMessageId = async(req,res,next)=>{
      const userId = req.user.id;
      const {messageId,seenByUser} = req.body;
     // res.send(`update by userid : ${userId} with messageid : ${messageId}`);
     const results = await databaseService.updateMessagesbyUserIdMessageId(userId,messageId,seenByUser);
     if (!results.error)
     {
      res.send("DONE");
     }
      else{
        res.status(404).send(results.message);
      }
  };
  const deleteMessagesbyUserIdMessageId =async(req,res,next)=>{
    const userId = req.user.id;
    const {messageId} = req.body;
  
   const results = await databaseService.deleteMessagesbyUserIdMessageId(userId,messageId);
   if (!results.error)
   {
    res.send("DONE");
   }
    else{
      res.status(404).send(results.message);
    }
};

  module.exports = {getMessagesbyUserId,updateMessagesbyUserIdMessageId,deleteMessagesbyUserIdMessageId};