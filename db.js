const mongoose=require('mongoose')

const userschems=mongoose.Schema({
	username:{
		type:String,
		required:true,
		minLength:6,
		trim:true
	},
	firstname:{
		type:String,
		required:true,
		trim:true
	},
	lastname:{
		type:String,
		required:true,
		trim:true
	},
	password:{
		type:String,
		required:true,
		minLength:6
	}
})

const bank=mongoose.Schema({
	userId: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"user",
		required:true
	},
	balance:{
		type:Number,
		required:true
	}
})
 const User=mongoose.model('User',userschems);
const account=mongoose.model('account',bank);
module.exports={User,account}