import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();

router.post('/login', AuthController.loginUser);
router.post('/partner/login', AuthController.loginPartner);
router.post('/register', AuthController.registerUser);

export default router;