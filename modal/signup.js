const mongoose= require('mongoose');
const Schema=mongoose.Schema;
const newUser=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    },user_type:{
        type:String,
        required:true
    },contact:{
        type:String,
        required:false
    },address:{
        type:String,
        required:false
    },about:{
        type:String,
        required:false
    },img:{
        type:String,
        required:false
    }
})
module.exports=mongoose.model('User',newUser);