import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";
import { identifierToKeywordKind } from "typescript";

//doc berisi dari konfigurasi swagger nanti
const doc ={
    info : {
        version:"v0.0.1",
        title:"Dokumentasi API Acara",
        description:"Dokumentasi API Acara",

    },
    servers : [
        {
            url:"http://localhost:3000/api",
            description:"Local Server",
        },
        {
            url:"https://back-end-acara-lyart-eight.vercel.app/api",
            description:"Deploy Server",
        }
    ],
    //components untuk bagian schema misalkan login butuh skema data
    components : {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            },
        },
        schemas : {
            LoginRequest:{
                identifier:"Dayat",
                password:"12345"
            },
            RegisterRequest: {

                fullName: "member2025",
                
                username: "member2025",
                
                email: "member2025@yopmail.com",
                
                password: "Member2025!",
                
                confirmPassword: "Member2025!",
                
                },
                ActivationRequest: {
                    code: "abcdef",
                  }
        },
    },

};
// outputFile itu file json yang akan dibaca swager yg tidak perlu diotak atik
const outputFile = "./swagger_output.json";

//endpointsFiles diisi dengan array yang membaca enndpoint apa aja yang ada di API
const endpointsFiles = ["../routes/api.ts"]

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);