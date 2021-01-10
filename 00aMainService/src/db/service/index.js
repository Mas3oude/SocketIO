const mongoose = require('mongoose');
const dbManager = require('../dbManager');
const socketUser = require('../model/sockerUser');
const { redLog, greenlog,bluelog} = require('../../utils/coloredConsole');
//open database Connection
dbManager.OpenConnection();


/* #region Create */

const createOrUpdateUser= async (currentSocket)=>{
    const currentUser  = await socketUser.findOne({userId:currentSocket.userId});
    if (currentUser)
    {
      const userupdated =   updateUser(currentSocket,currentUser);
      return userupdated;
    }
    else{
       const userCreated =  createUser(currentSocket);
       return userCreated;
    }
};

const createUser = async(currentSocket)=>{
    const newUser = new socketUser({
        userId : currentSocket.userId,
        email : currentSocket.email,
        connected : true,
        defaultNameSpace : process.env.DEFAULTNAMESPACE,
        socketIds : [
            {
                ip : currentSocket.ip,
                socketId:currentSocket.id
            }
        ]
    });
   
   await newUser.save()
    .then(
        results=> {greenlog(`usersaved \n user id : ${results.userId} email : ${results.email} socketid : ${results.socketIds}`);
        return true;
    })
    .catch(err=>{
        redLog(`error while saving ${err}`);
        throw err;
    });
};

const createUserMessage = async (senderUserId,targetUserId,messagePayLoad)=>{
    const targetUser = await findUserById(targetUserId);
    const message = {
        senderUserId : senderUserId,
        payload : messagePayLoad,
        sentToTarget : false
    }
    targetUser.messages.push(message);

    await targetUser.save()
    .then(saved=> {
        greenlog(`user with id : ${targetUser.userId} a message saved because he is offline current message : ${saved.messages}`);
        return true;
    })
    .catch(err=>{
        redLog(`Error while saving message in offline userid ${targetUser.userId}`);
        throw err;
    });
};
/* #endregion */

/* #region Update */
const updateUser = async(currentSocket,currentsocketUser)=>{
   
    currentsocketUser.socketIds.push(
        {
            ip : currentSocket.ip,
            socketId : currentSocket.id
        }
    );
    if (currentsocketUser.connected == false) // check if the current connection status of the user is false 
     {
         currentsocketUser.connected = true; //update to true
     }
     await currentsocketUser.save()
    .then(saved=> {greenlog(`user with id : ${currentSocket.userId} Updated with new Socketid : ${currentSocket.id} \n current sockets :  ${saved.socketIds}`);})
    .catch(err=>{
        redLog(`error while update user with id : ${currentSocket.userId} to updated with socketid : ${currentSocket.id}`);
        throw err;
    });
   
};

const updateConnectionStatus = async (isConnected, userId)=>{};
/*#endregion */

/* #region Delte */
const deleteUser = async(user)=>{

};

const removeSocketId = async (currentSocket)=>{
    const currentUser  = await socketUser.findOne({userId:currentSocket.userId});
    if (currentUser)
    {
        greenlog(`user with ID : ${currentUser.userId} disconnected with socketid : ${currentSocket.id}`);
         const index = currentUser.socketIds.findIndex(s=> s.socketId == currentSocket.id);
         currentUser.socketIds.splice(index, index >= 0 ? 1 : 0);
         if (currentUser.socketIds.length == 0)   // this is means that the user doesn't connect with any device to the system
         {
             currentUser.connected = false;      // set the connection status to false
         }
         await currentUser.save()
         .then(result => {
            greenlog(`USER UPDATED successfully with ID : ${currentUser.userId} disconnected with socketid : ${currentSocket.id} \n current Sockets: ${result.socketIds}`);
            return true;   
         } )
         .catch(err=>{
            redLog(`error while saving while removing socketid ${err}`);
            throw err;
         });
         
         
    }
    else{
        redLog(`can't find a user with ${currentsocket.userId}`);
        return false;
    }
};
/* #endregion */


/* #region retrieve */

const getAllUsers = async()=>{};

const isValidUser = async(userId)=>{
    const currentUser  = await socketUser.findOne({userId:userId}); 
    greenlog(`check if user is in database using isValidUser from SocketMiddleware  `);
    if (currentUser)
     {
         greenlog(`user found with id : ${currentUser.userId}`);
         return true;
     }
     else{
         redLog(`user not found in database`);
        return false;
     }
};

const findUserById = async(userId)=>{
    const currentUser  = await socketUser.findOne({userId:userId}); 
    if (currentUser)
     {
         greenlog(`user found with id : ${currentUser.userId}`);
         return currentUser;
     }
     else{
         redLog(`user not found in database`);
        return null;
     }
};
const isUserConnected = async(userId)=>{};
const isUserConnectedUpdateSocket = async(userId,socketId)=>{};

/* #endregion */






module.exports= {
createOrUpdateUser,
deleteUser,
removeSocketId,
updateConnectionStatus,
isValidUser,
findUserById,
createUserMessage
};