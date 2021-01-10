const mongoose = require('mongoose');

const socketUserSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId, should be added by default
    userId : {
        type:Number,
        required:true,
        unique: true
    },
    email  : {type:String,required:true},
    connected : {type:Boolean,required:true},
    defaultNameSpace : {type:String},
    socketIds : [
        {ip:String,
         socketId:{type:String,required:true},
        date: { type: Date, default: Date.now }
        }]
});


const socketUser = mongoose.model('socketUser',socketUserSchema);
module.exports = socketUser;