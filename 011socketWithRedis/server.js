require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
const favicon = require('serve-favicon');
const path = require('path');
const jwtProtect = require('./utils/jwtProtect');
const requestIp = require('request-ip');
//init express 
const app = express();

//init port
const PORT = process.env.PORT || 7011;
app.use(favicon(path.join(__dirname, 'public', 'redisIcon.png')));
app.use(express.static(__dirname+'/public'));

const expressServer = app.listen(PORT,(err)=>{if (err){console.error(`Error : ${err}`);}else{console.log(`server running in port : ${PORT}`);}});

// init socket.io
const io = socketio(expressServer,{
   //path : '/api/v1/testing',
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    serveClient: true
});

const validateUse = (socket,next)=>{
    const headerToken = socket.handshake.headers['authorization'];
    const actualToken = headerToken.replace('Bearer ', '');
 
    // const nameSpaceToken = socket.handshake.query.token;
    // const decoded = verifyToken(nameSpaceToken,process.env.JWT_ACCESS_KEY);
    const decoded = jwtProtect(actualToken,process.env.JWT_ACCESS_KEY);
     if (decoded) {
         if (decoded.id == 1)
          {
              nameSpaceUser.userid = decoded.id;
              nameSpaceUser.email = decoded.email;
              return next();
          }
          else{
           
           console.log(`valid token with invalid userid`);
           const err = new Error("not authorized invalid userid");
           err.data = { content: "Please retry later" }; // additional details
           next(err);
          }
     }
     else{
       console.log(`user not authorized`);
       const err = new Error("not authorized");
       err.data = { content: "Please retry later" }; // additional details
       next(err);
     }
};


io.use((socket,next)=>{
    validateUse(socket,next);
});
//socket.io MiddleWare
let nameSpaceUser = new Object();

let defaultNameSpace = io.of("/api/v1/testing");
defaultNameSpace.use((socket,next)=>{
    validateUse(socket,next);
    
  });

  defaultNameSpace.on('connect',(socket)=>{

    nameSpaceUser.socketid = socket.id;
    const client_ip_address = socket.handshake.address;//socket.request.connection.remoteAddress;
    //console.log(socket.request);
    const clientIP = requestIp.getClientIp(socket.request);
    console.log(clientIP);
    console.log(client_ip_address);
    console.log(`user with the following information : 
                 id : ${nameSpaceUser.userid}
                 socketid:${nameSpaceUser.socketid}
                 email : ${nameSpaceUser.email} `);
    

    socket.on('disconnect',(reason)=>{
    console.log(`display reason : ${reason}`);
    console.log(`socketid : ${socket.id}`);
    defaultNameSpace.emit('useDisConnected',{
        userid : socket.id
     });
    });
        
});
