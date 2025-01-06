import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        default:""
    },
    profilepic:{
        type:String,
        default:"",
    },
    gender:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const User=mongoose.model('User',userSchema);


export default User;