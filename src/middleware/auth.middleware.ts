import { NextFunction, Request, Response } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

//interface untuk mmeodifikasi request data agar argumen Request bisa digunakan terus  dengan modifikasi misalkan req.user
//Fungsi Middleware juga untuk memecah data sehingga  ketika token dipahami dapat mengambil info di dalamnya
export interface IReqUser extends Request {
    user?:IUserToken;
}
export default (req:Request,res:Response, next:NextFunction ) => {
const token = req.headers?.authorization;

if (!token) {
    return res.status(403).json({
        message:"unauthorized",
        data:null,
    });
}
//karena token itu string maka nanti akan dipecah dengan split menjadi array bisa berdasarkan spasi
//kenapa cuma 2 parameter karena sudah diketahui di dalam postman kl itu ada 2 macam saja
//ini sama seperti yang ada di register tapi object jadi menggunakan {} kl array string ya pakai [] 
//berarti disini prefix adalah bearer dan accessToken adalah tokennya
const [prefix, accessToken] = token.split(" ")
    if (!(prefix ===  "Bearer" && accessToken)) {
        return res.status(403).json({
            message:"unauthorized",
            data:null
        }); 
    }
        const user = getUserData(accessToken);
    if (!user) {
        return res.status(403).json({
            message:"unauthorized",
            data:null
        }); 
    }
    (req as IReqUser).user = user;
    //next akan menjalankan controller selanjutnya yangada di routing 
    next();
    
};