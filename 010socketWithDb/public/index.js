const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0dXNlckBlbWFpbC5jb20iLCJpZCI6MSwic3RhdHVzIjozLCJpYXQiOjE2MDk3NTEyMjUsImV4cCI6MTYxMDYxNTIyNX0.g9Kb_ms0yne1KUf18GPOLSXg-Sen4X9j2sM2waUex_g";
const invalidUserId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0dXNlckBlbWFpbC5jb20iLCJpZCI6Miwic3RhdHVzIjozLCJpYXQiOjE2MDk3NjMwMjMsImV4cCI6MTYxMDYyNzAyM30.UcAasmpp4hW00Os3WWkFv96V4mAW3vemNJzkqtR4h2M";

const socket = io("http://localhost:7010/api/v1/testing",
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

        socket.on('messageToClients',(data)=>{
                console.log(`data from server : ${data.text}`);
                document.querySelector('#messages').innerHTML += `<li> ${data.senderid} : ${data.text} </li>`;
            });
        
        socket.on('useDisConnected',(data)=>{
            
            console.log(`user with ID : ${data.userid}`);
            document.querySelector('#messages').innerHTML += `<li> user with id : ${data.userid} ====> DISCONNECTED </li>`;
        });
