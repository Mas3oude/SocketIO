require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
var favicon = require('serve-favicon');
const jwt = require('jsonwebtoken');
var path = require('path');

//init express 
const app = express();

//init port
const PORT = process.env.PORT || 7009;
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname+'/public'));

//listen to port
const expressServer = app.listen(PORT,(err)=>{if (err){console.error(`Error : ${err}`);}else{console.log(`server running in port : ${PORT}`);}});


const verifyToken = (token, secret) => {
    //console.log(`verify user token`);
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
    });
  };
  

const io = socketio(expressServer);

// middleware for authentication
io.use((socket, next) => {
    let token = socket.handshake.query.token;
    const verification = verifyToken(token,process.env.JWT_ACCESS_KEY);

  if (verification.id == 1) {
      
    return next();
  }
  else{
    console.log(`user not authorized`);
    const err = new Error("not authorized");
    err.data = { content: "Please retry later" }; // additional details
    next(err);
  }
 
  });
  
io.on('connection',(socket)=>{
    let socketToken = socket.handshake.query.token;
    console.log(`token from user : ${socketToken}`);
    console.log(`Default namespace : User with ID : ${socket.id} `);
    //publish with event
    //socket.send is the same like socket.emit
    socket.emit('messageFromServer',{data : `welcome to socket io server your id is : ${socket.id}`});

    // listen to event
    socket.on('messageFromClient',(dataFromClient) =>{
        if (dataFromClient)
        {
            console.log(dataFromClient.someData);
        }
    });

    socket.on('disconnect',(reason)=>{
        console.log(`browser with socket id : ${socket.nickname} is Disconnected`);
        console.log(`display reason : ${reason}`);
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
