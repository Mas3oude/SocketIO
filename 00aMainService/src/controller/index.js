const {
    NotFoundError,
    BadRequestError,
    ForbiddenError,
  } = require('../utils/errors');

  const databaseService = require('../db/service');

  const getMessagesbyUserId = async(req,res,next)=>{
      try{
        const userid = req.user.id;
        const {offset, limit} =req.query;
        const usermessages = await databaseService.getMessagesbyUserId(userid);
         res.json(usermessages);
    }
      catch(err)
      {
          next(err);
      }
  };

  module.exports = {getMessagesbyUserId};