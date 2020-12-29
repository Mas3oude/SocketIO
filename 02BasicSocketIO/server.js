const http = require('http');
const socketio = require('socket.io');

// init the server
const PORT = process.env.PORT  || 7001;
const server = http.createServer((req,res)=>{
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
        /** add other headers as per requirement */
      };
  
      if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
      }
  
      if (["GET", "POST"].indexOf(req.method) > -1) {
        res.writeHead(200, headers);
        res.end("Hello World");
        return;
      }
  
      res.writeHead(405, headers);
      res.end(`${req.method} is not allowed for the request.`);
});

//init the socketio 
// https://socket.io/docs/v3/handling-cors/
const io = socketio(server,{
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection',(socket,req)=>{
    // send will be emit from ws to socketio
    //websocket.send(`Welcome to my Websocket Server`);
    socket.emit('welcome','this is a message from the server');

    //getting the client message

    // websocket.on('message',(clientMsg) => {
    //     console.log(`messge send from Client : ${clientMsg}`);
    // });
    socket.on('message',(clientMsg)=>{
        console.log(`message sent from client : ${clientMsg.data}`);
    });
});


// start listening 
server.listen(PORT,(err)=>{
    if (!err)
    {
        console.log(`server is working fine in port : ${PORT}`);
    }
    else{
        console.error(`issue in starting the server : ${err}`);
    }
});