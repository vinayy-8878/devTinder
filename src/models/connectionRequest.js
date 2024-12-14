const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
  fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  status:{
    type:String,
    required:true,
    enum:{
        values:["ignored","accepted","rejected","interested"],
        message:` {VALUE} is incorrect status type.`
    }
  }
  },
  { timestamps: true }
);
connectionSchema.pre("save",function (next){
  const connectionRequestFromAndTo=this;
  if(connectionRequestFromAndTo.fromUserId.equals(connectionRequestFromAndTo.toUserId)){
    throw new Error("You cannnot send request to yourself.")
  }
  next();
})
connectionSchema.index({fromUserId:1,toUserId:1})
module.exports = mongoose.model("ConnectionRequest", connectionSchema);
