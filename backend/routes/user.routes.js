import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";

const userRoutes= Router()

userRoutes.post('/register',registerUser)

export default userRoutes;