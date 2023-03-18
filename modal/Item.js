const mongoose=require('mongoose');
const schema=mongoose.Schema;
const Item_schema=new schema({
    name:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    url_pic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});
module.exports=mongoose.model("Item",Item_schema);