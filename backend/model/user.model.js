import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    semester:{
        type:String,
        enum:['First','Third']
    },
    role:{
        type:String,
        default:'user'
    },
    emailSent: { type: Boolean, default: false }
})

export const User = mongoose.model('User',userSchema)