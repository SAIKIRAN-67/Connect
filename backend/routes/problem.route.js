import express from "express"
import {postProblem,getAllProblems, getProblem, getUserProblems, updateStatus, deleteProblem, updateDetails} from "../controllers/problem.controller.js";
const router=express();


router.post("/postproblem",postProblem)
router.get("/getallproblems",getAllProblems)
router.post("/getproblem",getProblem)
router.post("/getuserproblems",getUserProblems)
router.post("/updatestatus",updateStatus)
router.post("/deleteproblem",deleteProblem);
router.post("/editdetails",updateDetails);

export default router;