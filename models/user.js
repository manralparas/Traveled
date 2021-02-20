const mongoose = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const userSchema = new mongoose.Schema({

    username:String,
    password:String,
    likePost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]

});
userSchema.plugin(passportLocalMongoose);
const User= mongoose.model("User",userSchema);
module.exports=User;