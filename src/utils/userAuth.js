const jwt=require("jsonwebtoken")
const User = require("../models/user"); // Update path to your User model

const userAuth=async(req,res,next)=>{
    try {
        const cookies=req.cookies;
        const {token}=cookies;
         if(token){
           const decodeMessage=await jwt.verify(token,"Vinay8878@");
           const {_id}=decodeMessage;
           const user = await User.findOne({
             _id,
           });
           if(!user){
             throw new Error("User does not exist.")
           }
           req.user=user;
           next();
         }else{
           throw new Error("Please login again");
         }
        
       } catch (err) {
         res.status(400).send(err.message);
       }
}
module.exports={userAuth}