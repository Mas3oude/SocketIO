const socketio = require('socket.io');
const requestIp = require('request-ip');
const {verifyToken }= require('../middleware/jwtProtect');
const {redLog,yellowLog,bluelog} = require('../utils/coloredConsole');
/* #region publicVars */
let io ;
const defaultNameSpaceText = process.env.DEFAULTNAMESPACE || "/api/v1/notificationtest";
let defaultNameSpace;
/* #endregion */


/* #region private */ 
const validateUse =async (socket,next)=>{
    const headerToken = socket.handshake.headers['authorization'];
    const actualToken = headerToken.replace('Bearer ', '');
 
    // const nameSpaceToken = socket.handshake.query.token;
    // const decoded = verifyToken(nameSpaceToken,process.env.JWT_ACCESS_SECRET);
    const secretKey = process.env.JWT_ACCESS_SECRET || "jwt_access_secret";
    const decoded = verifyToken(actualToken,process.env.JWT_ACCESS_SECRET);
     if (decoded) 
     {
             socket.userId = decoded.id;
             socket.email = decoded.email;
             if (socket.handshake.address)
             {
                   socket.ip =  requestIp.getClientIp(socket.request);
             }
             next();
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

    socket.on('disconnect',async(reason)=>{
        bluelog(`display reason : ${reason}`);
        bluelog(`userId: ${socket.userId} socketid : ${socket.id}`);
        });
     bluelog(`adding testing sender event Listner`);
     socket.on('newMessgeToServer',(message)=>{
         console.log(`test is the socket still have the data  : ${socket.userId}`);
         yellowLog(`simulation message from RabbitMQ : ${socket.id}  text : ${message.text} `);
     });
};

/* #endregion */

/* #region public */
const initSocket = (expressServer)=>
{
try{
    // init socket.io
    bluelog('init socket io');
    io = socketio(expressServer,{
        cors: {
            origin: "*",
          methods: ["GET", "POST"]
        },
        //path : '/api/v1/testing',
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
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



/*#region Exports */

module.exports = {
    initSocket
}

/*#endregion */