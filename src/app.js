const express=require("express")
const app=express();
app.listen(3000);
app.use("/test",(req,res)=>{
    res.send("test server started")
})
app.use("/hello",(req,res)=>{
    res.send("hello server started")
})
app.listen(7777,()=>{
    console.log("server started successfully")
})
app.get("/user",(req,res)=>{
    res.send({firstname:"Vinay"});
})
app.post("/user",(req,res)=>{
    res.send("Data added successfully")
})