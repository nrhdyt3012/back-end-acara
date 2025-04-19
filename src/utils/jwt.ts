import { Types } from "mongoose";
import { User } from "../models/user.model";
import  jwt  from "jsonwebtoken";
import { SECRET } from "./env";
//Tujuan dipisah ada bagian masing masing supaya kebutuuhan genrate token untuk menyimpan data terutama id
 export interface IUserToken extends Omit<User, "password" 
 | "activationCode" 
 | "isActive" 
 | "email" 
 | "fullName" 
 | "profilePicture" 
 | "username"
 > {
    id?: Types.ObjectId;
 } 

// Digunakan saat login berhasil akan dibuatkan token
export const generateToken =(user: IUserToken) =>{
    const token = jwt.sign(user, SECRET, {
        expiresIn:"1h",
    });
};
//untuk mengambil data user
export const getUserData = () => {};