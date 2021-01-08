require('dotenv').config();
const redis = require('redis');

const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOSTNAME ;
let redisClient;
const init = ()=>{
    try{
    redisClient = redis.createClient(redisPort,redisHost);
    
    redisClient.on("error", function(error) {
        console.error(error);
    });
    console.log(`init method ............`);
    return true;
    }
    catch(exception)
    {
        console.log(`error while creating instance of redis exceptoin : ${exception}`);
        return false;
    }

};



const setKeyValue = (key,value)=>{
 const results =  redisClient.set(key,value);
 return results;
}
const getValueByKey = async (key)=>{
 return new Promise((resolve,reject)=>{
    redisClient.get(key,(err,data)=>{
        if (err)
        reject(err);
        else
        resolve(data);
    });
 })
 
};


module.exports = {
    init,
    setKeyValue,
    getValueByKey
};
