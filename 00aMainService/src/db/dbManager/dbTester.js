const Mongoose = require('mongoose');
require('dotenv').config();
const dbEnvConfig = require('./config');
const { redLog, greenlog,bluelog} = require('../../utils/coloredConsole');
const socketUser = require('../model/sockerUser');

const env = process.env.NODE_ENV || 'development';
bluelog(`value for the env  : ${env}`);
const dbConnectionString = dbEnvConfig[env].connectionString;

bluelog(`connection string for db : ${dbConnectionString}`);

const OpenConnection = ()=>{
    Mongoose.connect(dbConnectionString
        , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
           
        })
        .then(() => {
           greenlog("Database is connected ");
        }).catch(error => {
           redLog(`Error connection with database ==> ${error}`);
        });
};

const insertDataForTest = ()=>{
    const testUser = new socketUser(
        { userId : 1001,
          email  : `forTest@email.cz`,
         connected :true,
        defaultNameSpace : process.env.DEFAULTNAMESPACE,
        socketIds : [
            {ip:`172.0.0.100`,
             socketId:`abcdefghigklm`
            }]
        });

    testUser.save()
    .then(results=> {greenlog(`usersaved ${results}`)})
    .catch(err=>{redLog(`error while saving ${err}`)});
};
const updateUserForTest =async ()=>{
    const socketUpdate =
      {ip:`172.0.0.101`,
      socketId:`abc123456789`
        };
    // const testuser = await socketUser.findOneAndUpdate
    // ({userId : 1001}, {$push : {socketids : socketUpdate}},{safe: true, upsert: true, new : true})
    //  .then(result => greenlog(`now from finoneupdate ${result}`))
    //  .catch(err=>{redLog(`cant find the user ${err}`)});
    const result = await socketUser.findOne({userId : 1001})
    .then((currentsocketUser)=>{
      {
            bluelog(currentsocketUser);
           // currentsocketUser.socketIds.push(socketUpdate);
         const index =    currentsocketUser.socketIds.findIndex(s => s.socketId == socketUpdate.socketId);
         greenlog(`index of socketid : ${index}`);
         currentsocketUser.socketIds.splice(index, index >= 0 ? 1 : 0);
         console.log(currentsocketUser.socketIds);
            currentsocketUser.save();
      }
    })
    .catch(err=>{redLog(err)});
    bluelog(result);
};
OpenConnection();
//insertDataForTest();
updateUserForTest();
