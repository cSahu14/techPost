import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userId: string
}

const authenicate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");

    if(!token) {
        return next(createHttpError(401, "Authorize token is requied."))
    }

    try {
        const parsedToken = token.split(" ")[1];
        
        const decoded = verify(parsedToken, config.JWT_SECRET as string)

        const _req =  req as AuthRequest;

        _req.userId = decoded.sub as string;

        next();
    } catch (error) {
        return next(createHttpError(401, "Token expired."))
    }


}

export default authenicate;