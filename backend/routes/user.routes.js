import { Router } from "express";
import { getAllUsers, registerUser } from "../controller/user.controller.js";

const userRoutes= Router()

userRoutes.post('/register',registerUser)
userRoutes.get('/get',getAllUsers)

export default userRoutes;