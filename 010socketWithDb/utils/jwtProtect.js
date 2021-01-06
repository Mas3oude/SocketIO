
const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
    try{
    return jwt.verify(token, secret, {
      algorithms: ['HS256'],
    });
    }
    catch(err){
        console.log(`error in token verificiation ${err}`);
        return null;
    }
  };

module.exports = verifyToken;