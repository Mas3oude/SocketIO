require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
var favicon = require('serve-favicon');
const jwt = require('jsonwebtoken');
var path = require('path');
const requestIp = require('request-ip');

//init express 
const app = express();

//init port
const PORT = process.env.PORT || 7009;
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname+'/public'));

//listen to port
const expressServer = app.listen(PORT,(err)=>{if (err){console.error(`Error : ${err}`);}else{console.log(`server running in port : ${PORT}`);}});


const verifyToken = (token, secret) => {
    try{
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
    });
    }
    catch(err){
        console.log(`error in token verificiation ${err}`);
        return null;
    }
  };
  

const io = socketio(expressServer);

// middleware for authentication
// io.use((socket, next) => {
//     let token = socket.handshake.query.token;
//     const decoded = verifyToken(token,process.env.JWT_ACCESS_KEY);
//   if (decoded) {
//       if (decoded.id == 1)
//        {
//            return next();
//        }
//        else{
        
//         console.log(`valid token with invalid userid`);
//         const err = new Error("not authorized invalid userid");
//         err.data = { content: "Please retry later" }; // additional details
//         next(err);
//        }
//   }
//   else{
//     console.log(`user not authorized`);
//     const err = new Error("not authorized");
//     err.data = { content: "Please retry later" }; // additional details
//     next(err);
//   }
 
//   });
  
// io.on('connection',(socket)=>{
//     let socketToken = socket.handshake.query.token;
//     console.log(`token from user : ${socketToken}`);
//     console.log(`Default namespace : User with ID : ${socket.id} `);
//     //publish with event
//     //socket.send is the same like socket.emit
//     socket.emit('messageFromServer',{data : `welcome to socket io server your id is : ${socket.id}`});

//     // listen to event
//     socket.on('messageFromClient',(dataFromClient) =>{
//         if (dataFromClient)
//         {
//             console.log(dataFromClient.someData);
//         }
//     });

//     socket.on('disconnect',(reason)=>{
//         console.log(`browser with socket id : ${socket.nickname} is Disconnected`);
//         console.log(`display reason : ${reason}`);
//         io.emit('useDisConnected',{
//             userid : socket.id
//         });
//     });

// });


let nameSpaceUser = new Object();
// trying long namespace
const longnameSpace = io.of('/api/v1/testing');
longnameSpace.use((socket,next)=>{
  debugger;
   const headerToken = socket.handshake.headers['authorization'];
   const actualToken = headerToken.replace('Bearer ', '');

   // const nameSpaceToken = socket.handshake.query.token;
   // const decoded = verifyToken(nameSpaceToken,process.env.JWT_ACCESS_KEY);
   const decoded = verifyToken(actualToken,process.env.JWT_ACCESS_KEY);
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
});
longnameSpace.on('connect',(socket)=>{
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
    io.emit('useDisConnected',{
        userid : socket.id
     });
    });
        
});



// const adminNameSpace = io.of('/admin');
// const adminNameSpaceText = `adminNameSpace: `;
// adminNameSpace.on('connect',(socket)=>{

//     console.log(`${adminNameSpaceText} user with id : ${socket.id} connected`);
//     adminNameSpace.emit('welcome',
//      {
//          data:{
//                 text: `welcome to admin channel`
//               }
//     }
//     );

// });
