const mongoose = require('mongoose');

const socketUser= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid : Number,
    connected : Boolean,
    color : String,
    MaxNumberOfConnection : Number,
    defaultNameSpace:String,
    socketIds: [{ ip: String, socketId: String }]
});


module.exports = mongoose.model('socketUser',socketUser);