require('dotenv').config();
const amqp = require('amqplib');
const {redLog,
      greenlog,
      bluelog,
      yellowLog,
      lightBlueLog}  = require('../../utils/coloredConsole');
const emailMsg = require('../model/emailMsg');
const socketIoService = require('../../socketioManager/socket');
const sendEmail = require('../../emailManager/email');



const rbitMQ = process.env.RABBITMQSERVER;
const username = process.env.MQUSERNAME;
const password = process.env.PASSWORD;
const  queueName = process.env.EMAIL_QUEUENAME;

lightBlueLog(`Display all parameters :       \n
             MQServerURL  : ${rbitMQ}       \n
             username     : ${username}     \n
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

    greenlog(`..................EMAIL Waiting for the messages........................`);

    channel.consume(queueName, message=>{
      let msgObj;
      try{
       msgObj = JSON.parse(message.content.toString());
      }
      catch(ex){
        redLog(`exception while paring the message this is  critical ${ex}`);
        throw(ex);
      }
      const messageQ = new emailMsg(msgObj.message,msgObj.emailLst);
      lightBlueLog(`email subject : ${messageQ.subject} email payload : ${messageQ.payload} \n email list : ${messageQ.emailLst}`);
      yellowLog(message.content.toString());
      sendEmail(messageQ)
      .then(result => {greenlog(`email send sucessfully ${result}`);})
      .catch(err=>redLog(`error while sending email : ${err}`));

    },{noAck:true});  // in current case i don't need to keep the message in the MQ because it will be saved in database if the user is offline
                       // TODO Question  save the message to if the user online 
    //false means that the message will not be removed from the Q 
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