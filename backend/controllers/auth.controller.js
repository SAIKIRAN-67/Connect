import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const signup=async(req,res)=>{
    const {email,password,confirmPassword}=req.body;

    console.log("email:",email);
    var existedUser=await User.findOne({email});
    console.log(existedUser);
    if(existedUser) {
        return res.json({message:"User already exist",success:false});
        
    }
    if(password!==confirmPassword){
        return res.json({message:"Password and confirm password missmatch"});
    }
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({email,password:hashedPassword});
    try {
        await newUser.save();
        return res.status(201).json({message:"User Created successfully"})
    } catch (error) {
        return error;
    }
}
export const signin=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
          const validUser=await User.findOne({email});
          if(!validUser) return next(errorHandler(404,"User  not found!"));
          const validPassword=bcryptjs.compareSync(password,validUser.password);
          if(!validPassword) return next(errorHandler(401,'Wrong credential'));
          const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
          const {password:pass,...rest}=validUser._doc
          return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        return next(error)
    }
}
export const google = async (req, res) => {
    const {email}=req.body;
    console.log("g",email);
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: password, ...rest } = user._doc;
        return res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          email: req.body.email,
          password: hashedPassword,
          verified:true
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        return res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      return error;
    }
  };