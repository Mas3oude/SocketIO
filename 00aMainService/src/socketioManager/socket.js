const socketio = require('socket.io');
const requestIp = require('request-ip');
const verifyToken = require('../middleware/jwtProtect');
const {redLog,yellowLog,bluelog} = require('../utils/coloredConsole');
const databaseService = require('../db/service');
/* #region publicVars */
let io ;
const defaultNameSpaceText = process.env.DEFAULTNAMESPACE || "/api/v1/notification";
let defaultNameSpace;
/* #endregion */


/* #region private */ 
const validateUse =async (socket,next)=>{
    const headerToken = socket.handshake.headers['authorization'];
    const actualToken = headerToken.replace('Bearer ', '');
 
    // const nameSpaceToken = socket.handshake.query.token;
    // const decoded = verifyToken(nameSpaceToken,process.env.JWT_ACCESS_KEY);
    const decoded = verifyToken(actualToken,process.env.JWT_ACCESS_KEY);
     if (decoded) 
     {
        const isValidUser = await databaseService.isValidUser(decoded.id);
        
        if (isValidUser == true)
         {
            bluelog(`user trying to connect with userid : ${decoded.id} is valid user . action will be update the socket`);
         }
        else
         {
           redLog(`user trying to connect with userid : ${decoded.id} is Not found in database . action will be create the USER`);
         }
             socket.userId = decoded.id;
             socket.email = decoded.email;
             if (socket.handshake.address)
             {
                   socket.ip =  requestIp.getClientIp(socket.request);
             }
             next();
        //  }
        //  else{
          
        //   redLog(`valid token with invalid userId`);
        //   const err = new Error("not authorized invalid userId");
        //   err.data = { content: "Please retry later" }; // additional details
        //   next(err);
        //  }
     }
     else{
       redLog(`user not authorized`);
       const err = new Error("not authorized");
       err.data = { content: "Please retry later" }; // additional details
       next(err);
     }
};

const onConnect = async (socket)=>{
  
    bluelog(`Connection started with userId : ${socket.userId} and socketID : ${socket.id}`);
    bluelog(`start saving the records to MongoDB `);
    const dbAction = await databaseService.createOrUpdateUser(socket);
    if (dbAction == true)
    bluelog(`user created or updated successfull`);
    
    bluelog(`set the listner for Disconnect`);

    socket.on('disconnect',async(reason)=>{
        bluelog(`display reason : ${reason}`);
        bluelog(`userId: ${socket.userId} socketid : ${socket.id}`);
        const removeUser = await databaseService.removeSocketId(socket);
        if (removeUser == true)
         bluelog(`user disconnected and socketid removed from database`);
        // defaultNameSpace.emit('useDisConnected',{
        //     userId : socket.userId,
        //  });
        });
     bluelog(`adding testing sender event Listner`);
     socket.on('newMessgeToServer',(message)=>{
         console.log(`test is the socket still have the data  : ${socket.userId}`);
         yellowLog(`simulation message from RabbitMQ : ${socket.id}  text : ${message.text} `);
        // sendNotificationByUserId (socket.userId,2,message.text);
     });
};

const onDisconnect =(reason)=>{
     //TODOMMASSOUD get the user id from the token
    // REMOVE the userId with socketid 

    bluelog(`Disconnect started with userId : ${socket.userId} and socketID : ${socket.id}`);
    // socket.on('disconnect',(reason)=>{
    //     console.log(`display reason : ${reason}`);
    //     console.log(`socketid : ${socket.id}`);
    //     defaultNameSpace.emit('useDisConnected',{
    //         userId : socket.id
    //      });
    //     });

};
/* #endregion */

/* #region public */
const initSocket = (expressServer)=>
{
try{
    // init socket.io
    bluelog('init socket io');
    io = socketio(expressServer,{
        //path : '/api/v1/testing',
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false,
        serveClient: true
    });

    bluelog(`set authentication middleware for default connection`);
    io.use((socket,next)=>{
        validateUse(socket,next);
    });

    bluelog(`create default name space `);
    bluelog(`default namespace path : ${defaultNameSpaceText}`);
    defaultNameSpace  =  io.of(defaultNameSpaceText);


    bluelog(`set middleware for authentication`);
    defaultNameSpace.use((socket,next)=>{
        validateUse(socket,next);
        
    });

    bluelog('set the listner for connection');
    defaultNameSpace.on('connect',onConnect);

   
    
}
catch (err)
{
    redLog(`error while creating socket.io ${err}`);
    throw err;
}
};

/* #endregion */


const sendNotificationByUserId= async (senderUserId, targetUserId, messagePayLoad)=>{

    bluelog(`trying to send notification for userid [By Parameter]: ${targetUserId}`);
    const targetUser = await  databaseService.findUserById(targetUserId);

    if (targetUser)
    {
        bluelog(`user found to send notification userid [From Database]: ${targetUser.userId}`);
        bluelog(`user current connection status is ${targetUser.connected}`);
        if (targetUser.connected == true && targetUser.socketIds.length > 0) 
        {
            bluelog(`user status is connected `);
            bluelog(`notification will be send`);
            if (targetUser.socketIds.length == 1)
            {
                defaultNameSpace.to(targetUser.socketIds[0].socketId).emit('Notification',messagePayLoad);
            }
            else{
                for (let i = 0 ; i < targetUser.socketIds.length ; i ++)
                {
                    defaultNameSpace.to(targetUser.socketIds[i].socketId).emit('Notification',messagePayLoad);
                }
            }
            bluelog(`notification sent successfully`);
        }
        else{
            yellowLog(`user status is offline`);
            yellowLog(`notification will be saved in database`);
            const saveMessageResults = await databaseService.createUserMessage(senderUserId,targetUserId,messagePayLoad);
            if (saveMessageResults == true)
            bluelog(`message save successfully to database`);
        }
    }
    
};




/*#region Exports */

module.exports = {
    initSocket,
    sendNotificationByUserId
}

/*#endregion */