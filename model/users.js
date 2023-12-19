const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { response } = require("express")
const userSchema = new mongoose.Schema({

    username : {
        type : String
    },
    email : {
        type : String   
    },
    password : {
        type : String
    },
    img : {
        type : String
    },
    Tokens : [
        {
            token  :{
                type:String
            }
        }
    ]
})


userSchema.pre("save",async function(){
    try {
        if(this.isModified("password"))
        {
            this.password = await bcrypt.hash(this.password,10);
        }
    } catch (error) {
        
    }
})

userSchema.methods.generateToken =async function(){

    try {
        const token = await jwt.sign({_id:this._id},process.env.SKEY)
        this.Tokens =  this.Tokens.concat({token:token})
        this.save()
        return token;
    } catch (error) {
        console.log(error);
    }

}


module.exports=new mongoose.model("User",userSchema)