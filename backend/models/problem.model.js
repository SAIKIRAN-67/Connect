import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const problemSchema = new mongoose.Schema({
    problemId: {
        type: String,
        unique: true,
        default: uuidv4,
    },
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    constituency: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
    status: {
        type: String,
        default: 'Inprogress',
    },
    category:{
        type:String,
        required:true
    },
    mobilenumber: {
        type: Number,
        required: true,
    },
    details:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
