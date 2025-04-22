import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';

import {sendMail, renderMailHtml} from "../utils/mail/mail"
import { CLIENT_HOST } from '../utils/env';
export interface User {
    fullName : string;
    username:string;
    email:string;
    password: string;
    role:string;
    profilePicture: string;
    isActive:boolean;
    activationCode: string;
    createdAt:string;
}

const Schema = mongoose.Schema

const UserSchema = new Schema<User>({
    fullName: {
        type:Schema.Types.String,
        required: true
    },
    username: {
        type:Schema.Types.String,
        required: true
    },
    email: {
        type:Schema.Types.String,
        required: true
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
    next();
});

//saat berhasil register juga dikirimkan email
UserSchema.post("save", async function (doc, next) {
    const user = doc;
    console.log("Send email to :", user.email);

    const contentMail = await renderMailHtml("registration-success.ejs", {
        username:user.username,
        fullname: user.fullName,
        email : user.email,
        createdAt : user.createdAt,
        activationLink : `${CLIENT_HOST}/auth/activation?code=${activationCode}`
    });
});

//agar password tidak tampil meskipun sudah dienkripsi
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;