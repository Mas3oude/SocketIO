require('dotenv').config();
const jwt = require('jsonwebtoken');


const payload = {
    email:'firstuser@email.com',
    id : 2,
    status:3
};

const secret = process.env.JWT_ACCESS_KEY;
const expiresIn = process.env.JWT_Expiry;

const generateToken = (payload, secret, expiresIn) => {
    const options = {
      algorithm: 'HS256',
    };
    if (expiresIn) options.expiresIn = expiresIn;
    const token = jwt.sign(payload, secret, options);
    console.log(token);
  };
  

  generateToken(payload,secret,expiresIn);
  

  //token for 10 days from 04-Jan-2021
  /*
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0dXNlckBlbWFpbC5jb20iLCJpZCI6MSwic3RhdHVzIjozLCJpYXQiOjE2MDk3NTEyMjUsImV4cCI6MTYxMDYxNTIyNX0.g9Kb_ms0yne1KUf18GPOLSXg-Sen4X9j2sM2waUex_g
  **/

//invalid userid

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0dXNlckBlbWFpbC5jb20iLCJpZCI6Miwic3RhdHVzIjozLCJpYXQiOjE2MDk3NjMwMjMsImV4cCI6MTYxMDYyNzAyM30.UcAasmpp4hW00Os3WWkFv96V4mAW3vemNJzkqtR4h2M