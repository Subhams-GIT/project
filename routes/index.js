const express=require('express');
const userrouter=require('./user')
const accountrouter=require("./account")
const app=express();
const PORT=3000;
const rootRouter=express.Router();
const authMiddleware=require("./Middleware")
rootRouter.use('/user',userrouter)
rootRouter.use("/account",authMiddleware,accountrouter)

module.exports=rootRouter;