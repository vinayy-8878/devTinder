const mongoose=require("mongoose");
const connectDB=async()=>{
  await  mongoose.connect("mongodb+srv://NEW_USER:TKpsF0XNv28xaqjQ@backend.sout2.mongodb.net/devTinder");
}
module.exports=connectDB;
