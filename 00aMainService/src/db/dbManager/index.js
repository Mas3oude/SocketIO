const Mongoose = require('mongoose');
require('dotenv').config();
const dbEnvConfig = require('./config');
const { redLog, greenlog,bluelog} = require('../../utils/coloredConsole');

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
module.exports = {
    OpenConnection
}