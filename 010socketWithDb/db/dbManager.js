const mongoose = require('mongoose');
const socketUser = require('./models/socketUser');
// docker run -it -v mongodata:/data/db -p 27017:27017 --name mongodb -d mongo

const OpenConnection = ()=>{

    try{

        const uri = "mongodb://localhost:27017/?readPreference=primary&appname=mongodb-vscode%200.3.0&ssl=false";
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        // mongoose.connect("mongodb+srv://dbuser:QWy8vXl80lcJV889@cluster0.flc34.mongodb.net/SocketManager")
        .then((data)=>{
            console.log(`connection working fine `);
            console.log(`info from connection ${data}`);
        })
        .catch(error =>{
            if (error)
            console.log(`error in connection ${error}`)
        });

    }
    catch(exception)
    {
        console.log('Error While Open Connection ' + exception);
    }
};

const CreateModel = ()=>{
    const currentSocketUser = new socketUser({
        _id : new mongoose.Types.ObjectId(),
        userid : 100,
        connected : true,
        color : "White",
        MaxNumberOfConnection : 10,
        defaultNameSpace:'/api/v1/testing',
        socketIds: [{ ip: "172.0.0.100", socketId: "234mm23432m" },
                    { ip: "172.0.0.101", socketId: "jaskdajk1123" }]

    });
    currentSocketUser.save()
    .then(results=> {console.log(results)})
    .catch(err=>console.log(err));
};
const isConnected = ()=>{
    if (mongoose.connection.length > 0)
    {return true;}
    return false;
};


module.exports = {
    OpenConnection,
    isConnected,
    CreateModel};




