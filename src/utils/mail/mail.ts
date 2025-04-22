import nodemailer from "nodemailer";
import ejs from "ejs"
//untuk mengetahui lokasi file
import path from "path"
import {
    EMAIL_SMTP_HOST,
    EMAIL_SMTP_PASS,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_SECURE,
    EMAIL_SMTP_SERVICE_NAME,
    EMAIL_SMTP_USER
} from "../env";

// transport adalah nama function api nya
const transporter = nodemailer.createTransport({
    service:EMAIL_SMTP_SERVICE_NAME,
    host : EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
    secure: EMAIL_SMTP_SECURE,
    auth: {
        user:EMAIL_SMTP_USER,
        pass:EMAIL_SMTP_PASS,
    },
    requireTLS: true,
});

 export interface ISendMail {
    from: string;
    to: string;
    subject:string;
    html:string
 }
export const sendMail = async({
   ...mailParams
}: ISendMail) => {
    const result = await transporter.sendMail({
        ...mailParams,
    });
    return result;
};

//untuk merender ejs

export const renderMailHtml = async (template: string, data: any) => {
    const content = await ejs.renderFile(path.join(__dirname, `templates/${template}`));
    return content;
};
