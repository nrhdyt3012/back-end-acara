import { Types } from "mongoose";
import { User } from "../models/user.model";
import  jwt  from "jsonwebtoken";
import { SECRET } from "./env";
//Tujuan dipisah ada bagian masing masing supaya kebutuuhan genrate token untuk menyimpan data terutama id
 export interface IUserToken extends Omit<User,
 | "password" 
 | "activationCode" 
 | "isActive" 
 | "email" 
 | "fullName" 
 | "profilePicture" 
 | "username"
 > {
    //id ini adala id yang didapatkan di MongoDB
    id?: Types.ObjectId;
 } 

// Digunakan saat login berhasil akan dibuatkan token
export const generateToken =(user: IUserToken): string =>{
    const token = jwt.sign(user, SECRET, {
        //yanng berarti setelah 1 jam token ini akan kadaluarsa
        expiresIn:"1h",
    });
    return token;
};
//untuk mengambil data user
export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET) as IUserToken;
    return user;
};