import Problem from "../models/problem.model.js";

export const postProblem=async(req,res)=>{
    const {title,description,district,images,email,mobilenumber,constituency}=req.body;
    console.log(title,description,district,images,email,mobilenumber,constituency);
    try{
        if(email==null || title==null || description==null|| district==null || mobilenumber==null || constituency==null){
            return res.json({message:"Enter all required fields"});
        }
        const newProblem=new Problem({email,title,description,district,images,mobilenumber,constituency});
        const response=await newProblem.save();
        console.log(response)
        return res.status(201).json({message:"problem posted successfully"})
    }
    catch(error){
        console.log(error);
        return res.json({message:error});
    }
}

export const getAllProblems=async(req,res)=>{
    try {
        const problems = await Problem.find();
        return res.status(200).json(problems);
    } catch (error) {
        return res.status(400).json({message:error})
    }
}
export const getProblem=async(req,res)=>{
    try {
        const {problemId}=req.body;
        console.log("pro:",problemId);
        const problem=await Problem.findOne({problemId});
        console.log("problem:",problem);
        return res.status(200).json(problem);
    } catch (error) {
        return res.status(400).json({message:error});
    }
}
export const getUserProblems=async(req,res)=>{
    try {
        const {email}=req.body;
        console.log("email:",email);
        const problems=await Problem.find({email});
        console.log("problems:",problems);
        return res.status(200).json(problems);
    } catch (error) {   
        return res.status(400).json({message:error});
    }
}
export const updateStatus=async(req,res)=>{
    try {
        const {problemId,status}=req.body
        console.log(problemId);
        const problem=await Problem.findOneAndUpdate({problemId},{status:status});
        console.log(problem);
        return res.status(201).json({message:problem})
    } catch (error) {
        return res.status(400).json({message:error});
    }
}
export const updateDetails=async(req,res)=>{
    try {
        const {problemId,title,description,district,images,mobilenumber,constituency}=req.body;
        console.log("edit:",{title,description,district,images,mobilenumber,constituency})
        if(title==null || description==null|| district==null || mobilenumber==null || constituency==null){
            return res.json({message:"Enter all required fields"});
        }
        const response=await Problem.findOneAndUpdate({problemId},{title,description,district,images,mobilenumber,constituency})
        return res.status(201).json({message:response});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:error});
    }
}
export const deleteProblem=async(req,res)=>{
    try {
        const {problemId}=req.body;
        console.log(problemId);
        console.log("deletepro");
        const response=await Problem.findOneAndDelete({problemId});
        return res.status(201).json({message:response});
    } catch (error) {
        return res.status(400).json({message:error});
    }
}