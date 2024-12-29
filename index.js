const express = require("express");
const router1=require('./routes/index')
const cors=require('cors')
const app=express();
const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://admin:1wBbD6m8brGWP1jM@cluster0.jhhmwud.mongodb.net/paytm').then(()=>{
	console.log('db connected');
	
})
app.use(cors());
app.use(express.json()); 
app.use("/api/v1",router1);
app.listen(3000,()=>{
	console.log('server started');
	
});
/**
 /api/v1/user
 /api/v1/account
 */