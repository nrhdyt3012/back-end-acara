import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';

import {sendMail, renderMailHtml} from "../utils/mail/mail"
import { CLIENT_HOST, EMAIL_SMTP_USER } from '../utils/env';
export interface User {
    fullName : string;
    username:string;
    email:string;
    password: string;
    role:string;
    profilePicture: string;
    isActive:boolean;
    activationCode: string;
    createdAt?:string;
}

const Schema = mongoose.Schema

const UserSchema = new Schema<User>({
    fullName: {
        type:Schema.Types.String,
        required: true
    },
    //Ditambahkan fitur unique untuk username dan email agar tidak ada yang sama
    username: {
        type:Schema.Types.String,
        required: true,
        unique: true,
    },
    email: {
        type:Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type:Schema.Types.String,
        required: true
    },
    role: {
        type:Schema.Types.String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    profilePicture: {
        type:Schema.Types.String,
        default: "user.jpg"
    },
    isActive: {
        type:Schema.Types.Boolean,
        default: false,
    },
    activationCode: {
        type:Schema.Types.String,
    },
},
{
    timestamps:true,
}
);

UserSchema.pre("save", function (next){
    const user = this;
    user.password = encrypt(user.password);
    //sebelum di save password sudah di enkripsi
    //MongoDB secara otomatis menghasilkan _id bahkan sebelum dokumen disimpan.
    //Jadi kita bisa menggunakan _id untuk membuat activationCode.
    user.activationCode = encrypt(user.id); // Gunakan id
    next();
});

//saat berhasil register juga dikirimkan email
UserSchema.post("save", async function (doc, next) {
   try {
    const user = doc;
    console.log("Send email to :", user);

    const contentMail = await renderMailHtml("registration-success.ejs", {
        username:user.username,
        fullName: user.fullName,
        email : user.email,
        createdAt: user.createdAt,
        activationLink : `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`
    });
    await sendMail({
        //email yg didaftarkan di zoho
        from: EMAIL_SMTP_USER,
        to : user.email, 
        subject : "Aktivasi akun anda",
        html : contentMail,
    });
   } catch (error) {
    console.log(error)
   } finally {
    next();
   }
});

//agar password tidak tampil meskipun sudah dienkripsi
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.activationCode;
    return user;
};

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;