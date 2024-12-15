
const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

// const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../utils/userAuth");
userRouter.get(
    "/user/request/received",
    userAuth,
    async (req, res) => {
      try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,status:"interested"
        }).populate("fromUserId",["firstName","lastName","age","about","gender","skills"])
        res.json({
            message:"Data fetched succesfully",
            value:connectionRequests
        })
      } catch (err) {
        res.status(400).send(err.message);
      }
    }
  );


  userRouter.get(
    "/user/connections",
    userAuth,
    async (req, res) => {
      try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
          $or: [
            { toUserId:loggedInUser._id,status:"accepted" },
            { fromUserId:loggedInUser._id,status:"accepted" },
          ],
            
        }).populate("fromUserId", ["firstName", "lastName", "skills", "about"])
        .populate("toUserId", ["firstName", "lastName", "skills", "about"]);
        connectionRequests.forEach((row) => console.log(row));

        const data=connectionRequests.map((row)=>{
          if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return row.toUserId; // Return the receiver if you are the sender
          } else {
            return row.fromUserId; // Return the sender if you are the receiver
          }
        })
        res.json({
            message:"Data fetched succesfully",
            value:data
        })
      } catch (err) {
        res.status(400).send(err.message);
      }
    }
  );



  userRouter.get(
    "/feed",
    userAuth,
    async (req, res) => {
      try {
        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        const limit =parseInt(req.query.limit) ||10;
        const skip=(page-1)*limit;
        const connectionRequests=await ConnectionRequest.find({
          $or: [
            { toUserId:loggedInUser._id },
            { fromUserId:loggedInUser._id },
          ],
            
        }).select("fromUserId toUserId")
       
       const hideUsersFromFeed=new Set();
       console.log(connectionRequests)
       connectionRequests.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString()),
        hideUsersFromFeed.add(req.toUserId.toString())
       })
    const users=await User.find({
      $and:[
        {_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}
      ]
    }).select("firstName lastName age about gender skills").skip(skip).limit(limit)
        // res.json({
        //     message:"Feed fetched succesfully",
        //     value:users
        // })
        res.send(users)
      } catch (err) {
        res.status(400).send(err.message);
      }
    }
  );
module.exports = userRouter;