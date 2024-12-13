import { User } from "../model/user.model.js";

const registerUser = async (req,res) => {
    try {
        const {name,email,semester}=req.body;
        console.log(req.body);
        

        if(!email,!name,!semester){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user = await new User({name,email,semester})
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Register succesfully",
            user
        })
    } catch (error) {
        console.log(error);
        
    }
}
const getAllUsers = async (req,res) => {
    try {
    
        const user = await User.find()
        console.log(user)
        if(!user){
            return res.status(400).json({
                success:true,
                message:"Couldnot find any user"
            })
        }
        return res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        
    }
}
export {registerUser,getAllUsers}