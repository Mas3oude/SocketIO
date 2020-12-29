// https://www.npmjs.com/package/ws

const http = require('http');
//adding websocket
const webSocket = require('ws');


const httpServer = http.createServer((req,res)=>{
    res.end('I am connected working fine in port : 7000');
});



const wss = new webSocket.Server({
    server:httpServer
});

wss.on('headers',(headers,req)=>{
    console.log(headers);
});

wss.on('connection',(websocket,req)=>{
   // console.log(req);
   websocket.send(`Welcome to my Websocket Server`);
   websocket.on('message',(clientMsg) => {
       console.log(`messge send from Client : ${clientMsg}`);
   });
});


httpServer.listen(7000);

