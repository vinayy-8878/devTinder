const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../utils/userAuth");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }
const toUser=await User.findOne({_id:toUserId})
if(!toUser){
    throw new Error("User does not exists!.")
}
      const existingConnectionRequest = await ConnectionRequest.findOne({
       
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
       return res.status(404).json({ message: "Connection request already exists!." });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      if (status === 'interested') {
        res.json({
          message: req.user.firstName + " is " + status + " in " + toUser.firstName,
          data
        });
      } else if (status === 'ignored') {
        res.json({
          message: req.user.firstName + " has ignored " + toUser.firstName,
          data
        });
      } else {
        res.status(400).json({ message: "Invalid status" });
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:toRequestId",
  userAuth,
  async (req, res) => {
    console.log(req.params.toRequestId)
    console.log(req.user._id)
    try {
      console.log(req.params);

      const loggedInUser = req.user;
      const {toRequestId,status} = req.params
      // const status = req.params.status;
      const allowedStatus = ["accepted", "rejected"];
      
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }
const connectionReq=await ConnectionRequest.findOne({_id:toRequestId,toUserId:loggedInUser._id,status:"interested"})
console.log(connectionReq)
if(!connectionReq){
    throw new Error("Connection request not found.")
}
connectionReq.status=status;
const data=await connectionReq.save();
res.json({
  message: "Connection request: " + status,
});
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

module.exports = requestRouter;
