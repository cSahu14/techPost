import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userInterface";
import userModal from "./userModal";
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { AuthRequest } from "../middlewares/authenticate";

const signUp = async (req: Request, res: Response , next: NextFunction) => {

    const { userName, email, password, isAdmin } = req.body;

    if(!userName || !email || !password || !isAdmin ) {
        return next(createHttpError(411, "Error in inputs."))
    }
    
    if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))) {
        return next(createHttpError(411, `${password} is not a valid password.`))
    }

    try {
        const user = await userModal.findOne({ email });
        if(user) {
            return next(createHttpError(403, "User already exists with this username."))
        }
    } catch (error) {
        return next(createHttpError(500, "Server error."))
    }

    

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser: User | null;

    try {
        newUser = await userModal.create({
            userName,
            email,
            isAdmin,
            password: hashedPassword
        })
        if(!newUser) {
            return next(createHttpError(500, "Server error."))
        }
    } catch (error) {
        return next(createHttpError(500, "Server error."))
    }

    try {
        const token = sign({ sub: newUser._id}, config.JWT_SECRET as string, {
            expiresIn: "7d",
            algorithm: "HS256"
        })

        if(token) {
            res.status(200).json({
                message: "Signed up",
                accessToken: token
            })
        }
    } catch (error) {
        return next(createHttpError(500, "Server Error."))
    }
}

const signIn = async (req: Request, res: Response, next: NextFunction) => {

    const { userName, password } = req.body;

    if(!userName || !password ) {
        return next(createHttpError(403, "Wrong email or password."))
    }

    let user: User | null;

    try {
        user = await userModal.findOne({ userName });
        
        if(!user) {
            return next(createHttpError(403, "User not found."))
        }
    } catch (error) {
        return next(createHttpError(500, "Internal server error."))
    }

    const passwordcheck = await bcrypt.compare(password, user.password);
    if(!passwordcheck) {
        return next(createHttpError(404, "Wrong password."))
    }

    try {
        const token = sign({ sub: user._id}, config.JWT_SECRET as string, {
            expiresIn: "7d",
            algorithm: "HS256"
        })

        if(token) {
            res.status(200).json({
                message: "Signed in",
                accessToken: token
            })
        }
    } catch (error) {
        return next(createHttpError(500, "Server Error."))
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {

    const _req = req as AuthRequest;
    let user: User | null;

    try {

        user =  await userModal.findById({_id : _req.userId}, { password: 0})
        if(!user) {
            return next(createHttpError(404, "User not found."))
        }

        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (error) {
        return next(createHttpError(500, "Internal server error."))
    }
}

export {
    signUp,
    signIn,
    getUser
}