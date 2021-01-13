var ObjectId = require('mongoose').Types.ObjectId;
const {BadRequestError} = require('../utils/errors');

const validateUpdateMessageRequest = async(req,res,next)=>{
try{
    const {messageId,seenByUser} = req.body;
    if (messageId && seenByUser)
    {
        if (ObjectId.isValid(messageId) && typeof  seenByUser === "boolean")
        next();
        else
        throw new BadRequestError(`the message body should have messageId and seenByUser should be boolean `);
    }
    else{
        throw new BadRequestError(`the message body should have messageId and seenByUser `);
    }
}
catch (err)
{
    // throw (`invalid message id  ${err}` );
    next(err);
}
};
   

module.exports = validateUpdateMessageRequest;
