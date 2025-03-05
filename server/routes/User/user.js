import express from "express"
import { changepasswordValidator, passwordValidator, validateChangePassword, validateLogin } from "../../middleware/ValidatorMddleware.js";
import { validateSignup } from "../../middleware/ValidatorMddleware.js";
import { changePassword, login, logout, signup } from "../../controller/Authcontroller.js";
import AuthMiddleware from "../../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/signup",validateSignup,passwordValidator,signup);
router.post("/login",validateLogin,passwordValidator,login);
router.post("/logout",logout);
router.post("/change-password",AuthMiddleware,validateChangePassword,changepasswordValidator,changePassword);

export default router;
