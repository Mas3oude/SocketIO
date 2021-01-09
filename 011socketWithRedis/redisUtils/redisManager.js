require('dotenv').config();
const redis = require('redis');

const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOSTNAME ;
let redisClient;
const init = ()=>{
  
        redisClient = redis.createClient(redisPort,redisHost);
        return new Promise((res, rej) => {
            redisClient.on('connect', function() {
              res(redisClient);
            });
            redisClient.on('error', function(err) {
              rej(err);
            });
          });

};



const setKeyValue = (key,value)=>{
 return new Promise((resolve,reject)=>{
     redisClient.set(key,value,(err,reply)=>{
         if (err)
         reject(err);
         else
         resolve(reply);
     });
 });

}
const getValueByKey =  (key)=>{
 return new Promise((resolve,reject)=>{
    redisClient.get(key,(err,data)=>{
        if (err)
        reject(err);
        else
        resolve(data);
    });
 })
 
};

const saveHashSet = (key,value)=>{

};
const getHashSet = (key)=>{

};

module.exports = {
    init,
    setKeyValue,
    getValueByKey,
    saveHashSet,
    getHashSet
};
