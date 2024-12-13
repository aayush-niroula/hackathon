import { Router } from "express";
import { deleteUser, editUser, getAllUsers, registerUser } from "../controller/user.controller.js";

const userRoutes= Router()

userRoutes.post('/register',registerUser)
userRoutes.get('/get',getAllUsers)
userRoutes.put("/edit/:id", editUser);
userRoutes.delete("/delete/:id", deleteUser);

export default userRoutes;