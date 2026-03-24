import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import checkAuth from '../../middleware/checkAuth.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import { AuthController } from './auth.controller.js';


const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', checkAuth(UserRole.USER, UserRole.ADMIN), AuthController.logout);

export const AuthRoutes = router;