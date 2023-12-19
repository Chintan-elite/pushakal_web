const jwt = require("jsonwebtoken")
const User = require("../model/users")

const auth = async(req,resp,next)=>{

    try {
        
        const token =  req.cookies.jwt
        
        const data =  await jwt.verify(token,process.env.SKEY);
        const userdata = await User.findOne({_id:data._id})
      
        const tokendata =  userdata.Tokens.find(ele=>{
            return ele.token==token
        })

        if(tokendata==undefined)
        {
            resp.render("login",{err:"Please login first"})
            return;
        }

        if(data)
        {
            req.user = userdata;
            req.token = token
            next()
        }

    } catch (error) {
        console.log(error);
       resp.render("login",{err:"Please login first"})

    }


}


module.exports=auth