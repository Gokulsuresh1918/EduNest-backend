// routes.js

import express from 'express';
import { registerUser, otpVerification, resendOtp, login, googlelogin } from '../controller/authController';
import authenticateToken from '../middleware/authMiddleware'; 

const router = express.Router();

router.post('/signup', registerUser);
router.post('/otpVerification', otpVerification); 
router.post('/resendOtp', resendOtp); 
router.post('/login', login);
router.post('/googlelogin', googlelogin);

export default router;
