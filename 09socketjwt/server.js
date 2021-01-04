require('dotenv').config();
const express = require('express');
const socketio = require('socket.io');
var favicon = require('serve-favicon');
var path = require('path');

//init express 
const app = express();

//init port
const PORT = process.env.PORT || 7009;
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname+'/public'));

//listen to port
const expressServer = app.listen(PORT,(err)=>{if (err){console.error(`Error : ${err}`);}else{console.log(`server running in port : ${PORT}`);}});

const io = socketio(expressServer);

io.on('connection',(socket)=>{

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

    //starting with rooms
    socket.join('level1');
    //send the message to all the room except the sender because we are using the socket to send
    // the message not the namespace
    socket.to('level1').emit('joined',`${socket.id} : I have joined Level1 room`);
    /*here i will send it using the namespace which means all the users inside
     this room even the sender will recieve this message
    **/
  // io.of('/').to('level1').emit('joined',`message from namepsace user id : ${socket.id} just joined the room`);
});


const adminNameSpace = io.of('/admin');
const adminNameSpaceText = `adminNameSpace: `;
adminNameSpace.on('connect',(socket)=>{

    console.log(`${adminNameSpaceText} user with id : ${socket.id} connected`);
    adminNameSpace.emit('welcome',
     {
         data:{
                text: `welcome to admin channel`
              }
    }
    );

});
