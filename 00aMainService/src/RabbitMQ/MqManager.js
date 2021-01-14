const emailRMQ = require('./Consumers/emailQueue');
const notficationRMQ = require('./Consumers/notificationQueue');


module.exports = 
{
    emailRMQ,
    notficationRMQ
};