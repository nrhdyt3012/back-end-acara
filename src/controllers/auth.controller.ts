import { Request, Response } from "express";
import * as Yup from "yup" ;
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
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

            const user = new UserModel({
                fullName,
                email,
                username,
                password
              });
              const result = await user.save(); // ini memicu pre("save") dan mengenkripsi password 
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
    async login(req:Request, res:Response) {
        const {
            identifier,
            password,
        } =req.body as unknown as TLogin;
        try {
            //Ambil data user berdasarkan identifier mengarah ke email dan username
           const userByIdenttifier = await UserModel.findOne({
            //$or digunakan untuk memfilter dua data
            //userModel.findOne berguna untuk hanya mencari satu saja hasilnya
            $or: [{
                email: identifier,
            },
            {
                username:identifier,
            },
        ],
           });

           if(!userByIdenttifier) {
            return res.status(403).json({
                message: "user not found",
                data :null
            })
           };
            //validasi passsword apakah password yang dimasukkan di endpoint sama dengan yg ada di database jadi password yg di endpoint dienkripsi apakah sama dengan db
           const validatePassword: boolean = encrypt(password) === userByIdenttifier.password;
        if (!validatePassword) {
            return res.status(403).json({
                message: "user not found",
                data :null
            })
        };

        res.status(200).json({
            message:"Login Success",
            data:userByIdenttifier,
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