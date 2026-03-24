import { Router } from 'express';
import checkAuth from '../../middleware/checkAuth.js';
import { UserRole } from '../../../generated/prisma/enums.js';
import { UserController } from './user.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { updateProfileSchema } from './user.validation.js';



const router = Router();

// user routes
router.get('/me', checkAuth(UserRole.USER, UserRole.ADMIN), UserController.getMyProfile);
router.patch('/me', checkAuth(UserRole.USER, UserRole.ADMIN), validateRequest(updateProfileSchema), UserController.updateMyProfile);

// admin only routes
router.get('/', checkAuth(UserRole.ADMIN), UserController.getAllUsers);
router.patch('/:userId/status', checkAuth(UserRole.ADMIN), UserController.changeUserStatus);

export const UserRoutes = router;