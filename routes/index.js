import express from "express";
import {
  loginControllers,
  registerController,
  userControllers,
  refreshControler,
  productController,
} from "../controllers";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";

const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginControllers.login);
router.get("/me", auth, userControllers.me);
router.post("/refresh", refreshControler.refresh);
router.post("/logout", auth, loginControllers.logout);
router.post("/products",[auth, admin], productController.store);
router.put("/products/:id",[auth, admin], productController.update);
router.delete("/products/:id",[auth, admin], productController.distroy);
router.get("/products", productController.index);
router.get("/products/:id", productController.single);

export default router;

// 3 14 00
