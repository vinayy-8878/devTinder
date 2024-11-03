const express=require("express")
const app=express();
app.listen(3000);
app.use("/test",(req,res)=>{
    res.send("test server started")
})
app.use("/hello",(req,res)=>{
    res.send("hello server started")
})