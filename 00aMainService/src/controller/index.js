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
        const {offset, limit} =req.query;
        yellowLog(`offset value : ${offset} and limit value : ${limit}`);
        const usermessages = await databaseService.getMessagesbyUserId(userid,offset,limit);
         res.json(usermessages);
    }
      catch(err)
      {
          next(err);
      }
  };

  module.exports = {getMessagesbyUserId};