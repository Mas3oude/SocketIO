class notificationMsg {
    constructor (senderUserId,targetUserId,payload)
    {
        this.senderUserId = senderUserId;
        this.targetUserId = targetUserId;
        this.payload = payload;
    }

}

module.exports = notificationMsg;