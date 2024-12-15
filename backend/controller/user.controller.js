import { User } from "../model/user.model.js";

const registerUser = async (req,res) => {
    try {
        const {name,email,semester}=req.body;
        

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
        console.error(error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate entry detected. User with similar details already exists.",
            });
        }
        // General error response
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};
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

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, semester } = req.body;

        if (!id || !name || !email || !semester) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { name, email, semester },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log({id})
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


export {registerUser,getAllUsers,deleteUser,editUser}