import express from 'express';
import {register, login, logout} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register',authMiddleware ,register);
router.post('/login',authMiddleware, login);
router.post('/logout', authMiddleware, logout);


export default router;