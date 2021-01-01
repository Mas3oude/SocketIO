//using express
const express = require('express');
//import or using socketio
const socketio = require('socket.io');

//init express 
const app = express();

//init port
const PORT = process.env.PORT || 7003;
//middleware for statis resource
app.use(express.static(__dirname+'/public'));

//listen to port
//assign server to variable to be used by socketio
const expressServer = app.listen(PORT,(err)=>{
                                if (err)
                                {
                                    console.error(`Error : ${err}`);
                                }
                                else{
                                    console.log(`server running in port : ${PORT}`);
                                }
                            });

//assign server to socketio

//documentation for the serve 

//******************https://socket.io/docs/v3/server-api/index.html*******************
const io = socketio(expressServer,{
    //there are many options can be added while creating socket server
    path: '/socket.io', // this is the default value if you didn't add it 
    serveClient: true,// this is default value this means that you can  /socket.io/socket.io.js in html file instead of calling the CDN url
    // cors: {
    //     origin: "http://172.0.01:5500",
    //     methods: ["GET", "POST"],
    //     allowedHeaders: ["my-custom-header"],
    //     credentials: true
    //   }
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false

});

//here to add after on ... connect or connection .. they are the same
// and it is the default namespace which is / 
// you can add more namespaces which like routing 
//as example : /chat or /api/v1/chatting 
io.on('connection',(socket)=>{

    console.log(`connection to server : ${socket.id}`);

    //publish with event
    socket.emit('messageFromServer',{data : `welcome to socket io server your id is : ${socket.id}`});

    // listen to event
    socket.on('messageFromClient',(dataFromClient) =>{
        if (dataFromClient)
        {
            console.log(dataFromClient.someData);
        }
    });

    //socket here is just from one client
    // when i recieve it i wanna send it to all the sockets connected
    //so i am going to use io 
    socket.on('newMessgeToServer',(msg=>{
        console.log(msg.text);
        //to send the message to all the connected sockets
        io.emit('messageToClients',{text : msg.text , senderid : socket.id});
    }));

    socket.on('disconnect',(reason)=>{
        console.log(`browser with socket id : ${socket.id} is Disconnected`);
        console.log(`display reason : ${reason}`);
        io.emit('useDisConnected',{
            userid : socket.id
        });
    });
});

// const chatSocket = io.of('/chat',(socket)=>{
//     console.log(`connection from client with id : ${socket.id}`);
//     socket.emit('messageFromChat',{data: `simple message from chat namespace`});
// });
// chatSocket.on('messageFromClient',(dataFromClient) =>{
//     if (dataFromClient)
//     {
//         console.log(dataFromClient.someData);
//     }
// });