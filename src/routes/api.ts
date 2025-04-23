import  express from "express";

import authController from '../controllers/auth.controller'
import authMiddleware from "../middleware/auth.middleware"

const router = express.Router();

//parameter router ada 3 yaitu route.type (endpoint API dnegan tipe data string, )
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);
router.post('/auth/activation', authController.activation);

export default router;