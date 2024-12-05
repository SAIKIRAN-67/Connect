import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from 'path';
import authRouter from "./routes/auth.route.js"
import problemRouter from "./routes/problem.route.js"
import cors from 'cors';
dotenv.config()

const app=express();
app.use(cors());
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongodb")
    }).catch((err)=>{
        console.log(err);
})

const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log("server is running at port no 3000")
})
// app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/problem",problemRouter)
// app.use("/api/listing",listingRouter);

