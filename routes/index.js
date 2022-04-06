import express from "express";
import { loginControllers, registerController } from "../controllers";


const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginControllers.login)



export default router


// 2 08 00