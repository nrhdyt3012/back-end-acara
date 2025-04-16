import { Request, Response } from "express";

type TRegister = {
    fullName : string;
    username: string;
    email: string;
    pasword: string,
    confirmPassword: string;
};
export default {
    register(req:Request, res:Response) {
        const {
            username,
            email
        } =req.body as unknown as TRegister;
    },
};