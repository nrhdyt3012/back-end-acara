import { Request, Response } from "express";
import * as Yup from "yup" ;
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";
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
    password: Yup.string().required().min(6, "Password must be at least 6 characters")
    .test("at-least-one-uppercase-letter",
         "contains at least one uppercase letter",
          (value) => {
            if(!value) return false;
            const regex = /^(?=.*[A-Z])/;
            return regex.test(value);
        })
    .test("at-least-one-number",
         "contains at least one lowercase letter",
          (value) => {
            if(!value) return false;
            //harus ada angka dalam paswowrd
            const regex = /^(?=.*\d)/;
            return regex.test(value);
        })  
    ,
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password must be matched")

});
export default {
    async register(req:Request, res:Response) {
        /**
         #swagger.tags = ["Auth"]
         */
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
                password,
              });

            res.status(200).json({
                message: "Success Registration",
                data : result,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message:err.message,
                data:null
            });
        }

       
    },
    async login(req:Request, res:Response) {
        /**
         #swagger.tags = ["Auth"]
         #swagger.requestBody = {
         required: true,
    content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" }
            }
        }         }
         */
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
        isActive: true,
        //hanya user yang sudah aktif yang bisa login
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
            });
        }

        const token = generateToken({
            id: userByIdenttifier._id,
            role: userByIdenttifier.role,
        });

        res.status(200).json({
            message:"Login Success",
            data:token,
        });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message:err.message,
                data:null
            });
        }
    },
    async me(req:IReqUser, res:Response) {
        /**
        #swagger.tags = ["Auth"]
         #swagger.security = [{
         "bearerAuth" :[]
    }]
         */
        try {
            //KENAPA INI Tidak error karean ini diterima oleh express.js hanya dimodifikasi saja 
            const userData = req.user;
            const result = await UserModel.findById(userData?.id);

            res.status(200).json({
                message: "Success get profile",
                data:result
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message:err.message,
                data:null
            });
        }
    },
    async activation(req:Request, res:Response) {
         /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
      required: true,
      schema: {$ref: "#/components/schemas/ActivationRequest"}
     }
     */
        try {

            //endpoint akan diconsume melalui metthod post
            //dan mengirimkan data activationCode ke body
            const {code} = req.body as {code: string};

            const user = await UserModel.findOneAndUpdate({
                //mencari berdasarkan activationCode
                activationCode: code,
            },
            //property yang diupdate
            //isActive diubah menjadi true dan activationCode diubah menjadi null
            {
                isActive: true,
            },
            {
                //konfigurasi ketika ada perubahan langsung berubah tanpa perlu request ulang
                //new true artinya data yang diupdate langsung ditampilkan
                new: true,
            });
            res.status(200).json({
                message: "Success Activation User",
                data: user,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message:err.message,
                data:null
            });
        }
},
};