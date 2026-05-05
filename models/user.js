const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema(
    {
        email:{
            type:String,
            required:true
        }
    }
)

userSchema.plugin(passportLocalMongoose);   //Plugin will help to create username and pswd at its own and join them in user schema  

module.exports=mongoose.model("User",userSchema);