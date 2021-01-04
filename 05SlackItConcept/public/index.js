const socket = io("http://localhost:7005");
const adminSocket = io('http://localhost:7005/admin');

// when the connection established the socket.id will have value
socket.on('connect',()=>{
    console.log(`default name space : ${socket.id}`);
});

// listen to event
socket.on('messageFromServer',(data)=>{

    console.log(data);
    socket.emit('messageFromClient',{someData: `this is some data from the client with id : ${socket.id}`});

});
 
document.querySelector('#message-form').addEventListener('submit',
(event)=>{
    event.preventDefault();
    //console.log("form Submitted");
    const newMessage = document.querySelector('#user-message').value;
    //console.log(`new Messge : ${newMessage}`);
    socket.emit('newMessgeToServer',{text: newMessage});

});

socket.on('messageToClients',(data)=>{
        console.log(`data from server : ${data.text}`);
        document.querySelector('#messages').innerHTML += `<li> ${data.senderid} : ${data.text} </li>`;
    });

socket.on('useDisConnected',(data)=>{
    
    console.log(`user with ID : ${data.userid}`);
    document.querySelector('#messages').innerHTML += `<li> user with id : ${data.userid} ====> DISCONNECTED </li>`;
});

/**recieve notification from room 
the client code never know which room that he is using .. all of this stuff is developed in the
server and the client just listen to an event **/
socket.on('joined',(msg)=>{
    console.log(msg);
});

adminSocket.on('connect',()=>{
    console.log(`adminnampeSpace : ${adminSocket.id}`);
});

adminSocket.on('welcome',(data)=>{
    
    console.log(`message from admin channel : ${data.data.text}`);
});