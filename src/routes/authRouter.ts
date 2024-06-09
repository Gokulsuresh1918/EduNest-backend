// routes.js

import express from "express";
import {
  otpVerification,
  resendOtp,
  verify,
} from "../controller/authController/otpVerification";
import { registerUser } from "../controller/authController/signUp";
import { login, googlelogin } from "../controller/authController/login";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/otpVerification", otpVerification);
router.get("/verify", verify);
router.post("/resendOtp", resendOtp);
router.post("/login", login);
router.post("/googlelogin", googlelogin);

export default router;
