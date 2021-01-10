require('dotenv').config();
const amqp = require('amqplib');
const {redLog,
      greenlog,
      bluelog,
      yellowLog,
      lightBlueLog}  = require('../utils/coloredConsole');
const notificationMsg = require('./model/notificationMsg');
const socketIoService = require('../socketioManager/socket');

const rbitMQ = process.env.RABBITMQSERVER;
const username = process.env.MQUSERNAME;
const password = process.env.PASSWORD;
const  queueName = process.env.QUEUENAME;

lightBlueLog(`Display all parameters :       \n
             MQServerURL  : ${rbitMQ}       \n
             username     : ${username}     \n
             password     : ${password}     \n 
             queuename    : ${queueName}    \n`);


const opt = { credentials: require('amqplib').credentials.plain(username, password) };

const mqClientInit = async()=>{
  try{
    const connection = await amqp.connect(rbitMQ,opt);
    lightBlueLog(`connection created DONE`);

    const channel = await connection.createChannel();
    lightBlueLog(`channel created DONE`);

    const result = await channel.assertQueue(queueName);
    lightBlueLog(`asset queue done DONE`);

    greenlog(`..................Waiting for the messages........................`);

    channel.consume(queueName, message=>{
      const messageQ = new notificationMsg(1,2,`this is just testing message from me \n message from MQ :  ${message.content.toString()} `);
      lightBlueLog(messageQ.senderUserId +" "+ messageQ.targetUserId +" " +messageQ.payload);
      yellowLog(message.content.toString());
      socketIoService.sendNotificationByUserId(
          messageQ.senderUserId,
          messageQ.targetUserId,
          messageQ.payload);

    },{noAck: false}); //false means that the message will not be removed from the Q 
                      //yes means that the message will be REMOVED from the Q 
  }
  catch (error)
  {
   redLog(error);
   throw error;
  }
};

const testConnection = ()=>{
    //TODOMMASSOUD  find away to heartbeat
};

module.exports = 
{
    mqClientInit,
    testConnection
};