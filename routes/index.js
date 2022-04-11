import express from "express";
import {
  loginControllers,
  registerController,
  userControllers,
  refreshControler,
} from "../controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginControllers.login);
router.get("/me", auth, userControllers.me);
router.post("/refresh", refreshControler.refresh);
router.post("/logout", auth, loginControllers.logout);

export default router;

// 3 14 00
