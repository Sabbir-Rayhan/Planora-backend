import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { loginSchema, registerSchema } from './auth.validation';
import checkAuth from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', checkAuth(UserRole.USER, UserRole.ADMIN), AuthController.logout);

export const AuthRoutes = router;