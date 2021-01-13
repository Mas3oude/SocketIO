var ObjectId = require('mongoose').Types.ObjectId;
const {BadRequestError} = require('../utils/errors');

const validateUpdateMessageBody = async(req,res,next)=>{
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
   

const validateDeleteMessageBody = async(req,res,next)=>{
    try{
        const {messageId} = req.body;
        if (messageId)
        {
            if (ObjectId.isValid(messageId))
            next();
            else
            throw new BadRequestError(`the message body should have a valid messageid`);
        }
        else{
            throw new BadRequestError(`the message body should have messageId`);
        }
    }
    catch (err)
    {
        // throw (`invalid message id  ${err}` );
        next(err);
    }
    };
module.exports = 
{validateUpdateMessageBody,
    validateDeleteMessageBody};
