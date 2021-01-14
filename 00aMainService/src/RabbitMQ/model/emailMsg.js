class emailMsg {
    constructor (message,emailLst)
    {
        this.emailLst = emailLst;
        this.subject = message.subject;
        this.payload = message.payload;
    }

}

module.exports = emailMsg;