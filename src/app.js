const express = require("express");
const connectDB  = require("./config/database");
const app = express();
const User=require("./models/user") 
app.use(express.json());
app.post("/signup",async (req,res)=>{
  console.log(req.body)
    const user=new User(req.body)
    try{
        await user.save();
         res.send("User Added Successfully")
    }catch(err){
        res.status(400).send(err.message)
    }
})
app.get("/user",async (req,res)=>{
   const userId=req.body.userid;
    const user=await User.findById(userId);
    try{
        
         res.send(user)
    }catch(err){
        res.status(400).send("User not added")
    }
})
app.delete("/user",async (req,res)=>{
  const userId=req.body.userid;
   const user=await User.findByIdAndDelete(userId);
   try{
       
        res.send("User deleted successfully")
   }catch(err){
       res.status(400).send("User not deleted")
   }
})
app.patch("/user/:userid",async (req,res)=>{
  
    const userId=req.params?.userid;
    const data=req.body;
    try{
       const ALLOWED_UPDATES=["userid","firstName","lastName","age","gender","skills"];
       if (data.email || data.password) {
        throw new Error("Cannot change email and password.");
      }else if(data?.skills.length>10){
        throw new Error("Can add maximum of 10 skills.")
      }
      const invalidFields = Object.keys(data).filter((key) => !ALLOWED_UPDATES.includes(key));
    
      // If there are any invalid fields, throw an error
      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }
       const user=await User.findByIdAndUpdate({_id:userId},data,{runValidators:true})
         res.send("User updated successfully")
    }catch(err){
        res.status(400).send("User not updated"+err.message)
    }
})
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("server started successfully");
    });
  })
  .catch((err) => {
    console.log("connection to database failed");
  });
