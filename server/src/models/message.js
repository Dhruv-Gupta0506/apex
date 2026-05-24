const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    sender:{
        type:String,
        enum:['user','ai'],
        required:true
    },
    text:{
        type:String,
        requried:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Message=mongoose.model('Message',messageSchema);
module.export=Message;