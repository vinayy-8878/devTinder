const express = require("express");
const connectDB = require("./config/database");
const cookie=require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookie());

const authRouter=require("./Routes/auth")
const profileRouter=require("./Routes/profile")
const requestRouter=require("./Routes/requests")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
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
