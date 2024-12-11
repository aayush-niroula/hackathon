import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    semester:{
        type:String,
        enum:['first','third']
    },
    role:{
        type:String,
        default:'user'
    }
})

export const User = mongoose.model('User',userSchema)