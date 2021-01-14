require('dotenv').config();

const nodemailer = require("nodemailer");

const sendEmail = (message)=>{
   
     if (message.emailLst == null || message.emailLst.length == 0)
     {
         throw 'email list is empty';
     }
     
     // fill infromation from env variables
     const emailHost = process.env.EmailHOST;
     const emailPort = process.env.EmailPort;
     const emailSecure = process.env.Emailsecure;
     const emailUser = process.env.EmailUser;
     const emailPass = process.env.EmailPass;
     
     if (process.env.NODE_ENV === 'development')
     {
        console.log(`${new Date()}, email configurations : 
        emailHost : ${emailHost} \n
        emailPort : ${emailPort} \n
        emailSecure: ${emailSecure} \n
        emailUser : ${emailUser} \n
        emailPass : ${emailPass} ` );
     }
    return new Promise((resolve,reject) =>{

        let transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            secure: emailSecure, // true for 465, false for other ports
            tls:{
              rejectUnauthorized: false
          },
            auth: {
              user: emailUser,
              pass: emailPass
            },
          });

          transporter.sendMail({
            from: emailUser,
            to: message.emailLst.join(),//msg.to, //reciever of the email
            subject: message.subject, // Subject of the email
            html:message.payload, // html body
          },(err,info)=>{
              if (err)
              {
                reject(err);
              }
              else if (info)
              {
                resolve(info.response);
              }
          });
    
    } );
    }; 


     module.exports = sendEmail;


