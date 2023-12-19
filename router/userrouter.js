const router = require("express").Router()
const multer = require("multer")
const User = require("../model/users")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const auth = require("../middleware/auth")
const { log } = require("console")
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // Uploads is the Upload_folder_name 
        cb(null, "./public/profile") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, file.fieldname + "-" + Date.now()+".jpg") 
    } 
}) 

var upload = multer({
    storage:storage
}).single("image")
    


router.get("/",(req,resp)=>{
    resp.render("login")
})

router.get("/reg",(req,resp)=>{
    resp.render("registration")
})

router.get("/home",auth,async(req,resp)=>{

    try {
        
        const user = await User.find();
        resp.render("home",{userdata:user})
    } catch (error) {
        console.log(error);
    }
   
})
router.post("/adduser",upload,async(req,resp)=>{
   
    try {
        const user = new User({username:req.body.username,email:req.body.email,password:req.body.password,img:req.file.filename})
        const data = await user.save()
        resp.render("registration",{"msg":"registration successfully !!!"})
    } catch (error) {
        
    }
    
})

router.post("/userlogin",async(req,resp)=>{
    try {
        
        const user = await User.findOne({email:req.body.email})

        if(user.Tokens.length>=1)
        {
            resp.render("login",{"err":"Max userlimit reachec!!!"})
            return;
        }

        var isValid =   await bcrypt.compare(req.body.password,user.password)
        if(isValid)
        {
            const token = await user.generateToken()
            resp.cookie("jwt",token)
            resp.redirect("home")
        }
        else
        {
            resp.render("login",{"err":"Invalid credentials"})
        }

    } catch (error) {
        resp.render("login",{"err":"Invalid credentials"})
    }
})


router.get("/delete",async(req,resp)=>{
    try {
        const did = req.query.did;

        const data = await User.findByIdAndDelete(did);
        
        fs.unlinkSync("./public/profile/"+data.img);
        resp.redirect("home")
    } catch (error) {
        console.log(error);
    }
})

router.get("/edit",async(req,resp)=>{
    try {
        const eid = req.query.eid;
        const data = await User.findById(eid);
        resp.render("update",{udata:data})
    } catch (error) {
        console.log(error);
    }
})

router.post("/updateuser",upload,async(req,resp)=>{
    try {
        
        const id = req.body.id;
        const data = await User.findByIdAndUpdate(id,{username:req.body.username,email:req.body.email,img:req.file.filename});
        fs.unlinkSync("./public/profile/"+data.img);
        resp.redirect("home")

    } catch (error) {
        console.log(error);
    }
})

router.get("/logout",auth,async(req,resp)=>{

    var user = req.user;
    var token = req.token

    try {
        
        user.Tokens =  user.Tokens.filter(ele=>{
           
            return ele.token != token
        })

       

        await user.save();
        resp.clearCookie("jwt");
        resp.render("login")

    } catch (error) {
        console.log(error);
    }
})

router.get("/logoutall",auth,async(req,resp)=>{

    var user = req.user;
    var token = req.token

    try {
        
       user.Tokens = [];
       

        await user.save();
        resp.clearCookie("jwt");
        resp.render("login")

    } catch (error) {
        console.log(error);
    }
})

module.exports=router