import express from "express";
import { getUser, signIn, signUp } from "./userController";
import authenicate from "../middlewares/authenticate";
const userRouter = express.Router();


userRouter.post("/signUp", signUp)
userRouter.post("/signIn", signIn)
userRouter.get("/userDetails", authenicate, getUser)

export default userRouter;