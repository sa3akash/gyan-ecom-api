import express from "express";
import { loginControllers, registerController, userControllers } from "../controllers";
import auth from '../middlewares/auth'


const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginControllers.login)
router.get('/me',auth, userControllers.me)



export default router


// 2 08 00