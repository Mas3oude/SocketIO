//using express
const express = require('express');
//import or using socketio
const socketio = require('socket.io');
//import CORS
var cors = require('cors');
//import fav icon
var favicon = require('serve-favicon');
var path = require('path');

//init express 
const app = express();

//init port
const PORT = process.env.PORT || 7005;
//enable CORS
//middleware for statis resource
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(__dirname+'/public'));

app.options('*', cors());

//listen to port
const expressServer = app.listen(PORT,(err)=>{if (err){console.error(`Error : ${err}`);}else{console.log(`server running in port : ${PORT}`);}});

const io = socketio(expressServer);

//this means the default namepspace which is /
// io.on = io.of('/').on
io.on('connection',(socket)=>{

    socket.nickname= `user${socket.id}`;
    console.log(`connection to server : ${socket.id}`);

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

    socket.on('newMessgeToServer',(msg=>{
        console.log(msg.text);
        io.emit('messageToClients',{text : msg.text , senderid : socket.nickname});
    }));

    socket.on('disconnect',(reason)=>{
        console.log(`browser with socket id : ${socket.nickname} is Disconnected`);
        console.log(`display reason : ${reason}`);
        io.emit('useDisConnected',{
            userid : socket.nickname
        });
    });
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



//to send a message to specific socket 

// socket.to(anotherSocketId).emit('hey');
// socket.in(anotherSocketId).emit('hey');

// to send a mesage to a room
// consider here that the server who can send the message to all the room not the socket

// io.of(aNamespace).to(roomName).emit()
// io.of(aNamespace).in(roomName).emit()


// A namespace can send a message to the entire namespace

// io.emit()
// io.of('/').emit()
// io.of('/admin').emit()