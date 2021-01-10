const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlY29uZHVzZXJAZW1haWwuY29tIiwiaWQiOjIsInN0YXR1cyI6MywiaWF0IjoxNjEwMjkwNzYxLCJleHAiOjE2MTExNTQ3NjF9.1wByuRP0mtV-K10AUqGLZxQm0G1ry-353-bLrF5Q45w";
const invalidUserId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0dXNlckBlbWFpbC5jb20iLCJpZCI6Miwic3RhdHVzIjozLCJpYXQiOjE2MDk3NjMwMjMsImV4cCI6MTYxMDYyNzAyM30.UcAasmpp4hW00Os3WWkFv96V4mAW3vemNJzkqtR4h2M";

const socket = io("http://localhost:7000/api/v1/notification",
{
    extraHeaders :{
        Authorization: `Bearer ${validToken}`
    }
});

        // client-side
    socket.on("connect_error", err => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
    });
        //console.log(socket.id); // will not work here because it is async 
        //console.log(socket);
        
        // when the connection established the socket.id will have value
        socket.on('connect',()=>{
            console.log(`connection to namespace is working fine with id ${socket.id}`);
        });

        // listen to event
        socket.on('messageFromServer',(data)=>{

            console.log(data);
            socket.emit('messageFromClient',{someData: `this is some data from the client`});

        });
         
        document.querySelector('#message-form').addEventListener('submit',
        (event)=>{
            event.preventDefault();
            //console.log("form Submitted");
            const newMessage = document.querySelector('#user-message').value;
            //console.log(`new Messge : ${newMessage}`);
            socket.emit('newMessgeToServer',{text: newMessage});

        });

        socket.on('Notification',(data)=>{
                console.log(`data from server : ${data}`);
                document.querySelector('#messages').innerHTML += `<li> ${data}</li>`;
            });
        
        socket.on('useDisConnected',(data)=>{
            
            console.log(`user with ID : ${data.userid}`);
            document.querySelector('#messages').innerHTML += `<li> user with id : ${data.userid} ====> DISCONNECTED </li>`;
        });
