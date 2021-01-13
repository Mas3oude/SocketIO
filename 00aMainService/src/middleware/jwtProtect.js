
const jwt = require('jsonwebtoken');
const { NotAuthorizedError } = require('../utils/errors');
/**
 * middleware handler
 * verify the access token from the authorization header of the request
 * checks if the token is valid, and the user exists on the database
 * checks if the user has permission to create a profile
 */

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

const jwtAccessProtect = async (req, res, next) => {
  try {
    const bearerToken = req.header('Authorization');
    if (!bearerToken) {
      throw new NotAuthorizedError('not authorized');
    }

    // await AuthService.validateAccessToken(bearerToken);

    const token = bearerToken.replace('Bearer ', '');
    const decoded = verifyToken(token,process.env.JWT_ACCESS_KEY);
    const user = { id: decoded.id, email: decoded.email };
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyToken,
  jwtAccessProtect
};
