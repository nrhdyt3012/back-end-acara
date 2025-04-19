import { Request, Response } from "express";
import * as Yup from "yup" ;
import UserModel from "../models/user.model";
type TRegister = {
    fullName : string;
    username: string;
    email: string;
    password: string,
    confirmPassword: string;
};

type TLogin = {
    identifier:string;
    password: string;
};
const RegisterValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password must be matched")

});
export default {
    async register(req:Request, res:Response) {
        const {
            fullName,
            username,
            email,
            password,
            confirmPassword
        } =req.body as unknown as TRegister;

        try {
           await RegisterValidateSchema.validate({
                fullName, username,email, password,confirmPassword
            });

            const result = await UserModel.create({
                fullName, 
                email,
                username,
                password
            }) 
            res.status(200).json({
                message: "Success Registration",
                data : result,
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message:err.message,
                data:null
            });
        }

       
    },
};