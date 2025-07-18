
import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    publishYear:{
        type:Number,
        require:true
    },
    price:{
        type:Number,
        required:true
    },
})

export const Book = mongoose.model('cat',bookSchema);